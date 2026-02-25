import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Set "mo:core/Set";
import Iter "mo:core/Iter";
import Nat32 "mo:core/Nat32";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Int "mo:core/Int";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // ── Types ──────────────────────────────────────────────────────────────────

  type Role = {
    #farmer;
    #buyer;
    #admin;
  };

  type UserId = Nat32;
  type CropId = Nat32;
  type OrderId = Nat32;
  type NoticeId = Nat32;
  type GalleryId = Nat32;
  type InquiryId = Nat32;

  // UserProfile is the type exposed to the frontend via getCallerUserProfile /
  // saveCallerUserProfile / getUserProfile as required by the instructions.
  type UserProfile = {
    name : Text;
    phone : Text;
    role : Role;
    createdAt : Time.Time;
  };

  type User = {
    id : UserId;
    principal : Principal;
    name : Text;
    phone : Text;
    role : Role;
    createdAt : Time.Time;
  };

  type CropStatus = {
    #pending;
    #approved;
    #rejected;
  };

  type Crop = {
    id : CropId;
    cropName : Text;
    quantity : Nat;
    price : Nat;
    description : Text;
    farmerName : Text;
    farmerPhone : Text;
    imageUrl : Storage.ExternalBlob;
    status : CropStatus;
    farmerPrincipal : Principal;
    createdAt : Time.Time;
  };

  type OrderStatus = {
    #pending;
    #accepted;
    #rejected;
  };

  type Order = {
    id : OrderId;
    cropId : CropId;
    buyerPrincipal : Principal;
    buyerName : Text;
    buyerPhone : Text;
    message : Text;
    status : OrderStatus;
    createdAt : Time.Time;
  };

  type Notice = {
    id : NoticeId;
    title : Text;
    content : Text;
    createdAt : Time.Time;
    postedBy : Text;
  };

  type GalleryItem = {
    id : GalleryId;
    imageUrl : Text;
    caption : Text;
    createdAt : Time.Time;
  };

  type ContactInquiry = {
    id : InquiryId;
    name : Text;
    phone : Text;
    email : ?Text;
    message : Text;
    createdAt : Time.Time;
  };

  type CropInput = {
    cropName : Text;
    quantity : Nat;
    price : Nat;
    description : Text;
    farmerName : Text;
    farmerPhone : Text;
    image : Storage.ExternalBlob;
  };

  // ── Stable storage ─────────────────────────────────────────────────────────

  let usersByPrincipal = Map.empty<Principal, User>();
  let crops = Map.empty<CropId, Crop>();
  let orders = Map.empty<OrderId, Order>();
  let notices = Map.empty<NoticeId, Notice>();
  let gallery = Map.empty<GalleryId, GalleryItem>();
  let contactInquiries = Map.empty<InquiryId, ContactInquiry>();

  var userIdCounter : Nat32 = 0;
  var cropIdCounter : Nat32 = 0;
  var orderIdCounter : Nat32 = 0;
  var noticeIdCounter : Nat32 = 0;
  var galleryIdCounter : Nat32 = 0;
  var inquiryIdCounter : Nat32 = 0;

  // ── Required profile helpers ───────────────────────────────────────────────

  /// Return the profile of the calling authenticated user.
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can fetch their profile");
    };
    switch (usersByPrincipal.get(caller)) {
      case (null) { null };
      case (?u) {
        ?{
          name = u.name;
          phone = u.phone;
          role = u.role;
          createdAt = u.createdAt;
        };
      };
    };
  };

  /// Persist (create or update) the profile of the calling authenticated user.
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can save their profile");
    };
    let existing = usersByPrincipal.get(caller);
    let id : Nat32 = switch (existing) {
      case (?u) { u.id };
      case (null) {
        userIdCounter += 1;
        userIdCounter;
      };
    };
    let user : User = {
      id;
      principal = caller;
      name = profile.name;
      phone = profile.phone;
      role = profile.role;
      createdAt = profile.createdAt;
    };
    usersByPrincipal.add(caller, user);
  };

  /// Fetch another user's profile. Callers may only view their own profile
  /// unless they are an admin.
  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    switch (usersByPrincipal.get(user)) {
      case (null) { null };
      case (?u) {
        ?{
          name = u.name;
          phone = u.phone;
          role = u.role;
          createdAt = u.createdAt;
        };
      };
    };
  };

  // ── User registration ──────────────────────────────────────────────────────

  /// Register (or update) the calling user's full record.
  public shared ({ caller }) func registerUser(name : Text, phone : Text, role : Role) : async Nat32 {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can register");
    };
    // Prevent self-escalation to admin through this endpoint.
    switch (role) {
      case (#admin) {
        Runtime.trap("Unauthorized: Admin role cannot be self-assigned");
      };
      case (_) {};
    };
    let existing = usersByPrincipal.get(caller);
    let id : Nat32 = switch (existing) {
      case (?u) { u.id };
      case (null) {
        userIdCounter += 1;
        userIdCounter;
      };
    };
    let user : User = {
      id;
      principal = caller;
      name;
      phone;
      role;
      createdAt = Time.now();
    };
    usersByPrincipal.add(caller, user);
    id;
  };

  // ── Crop management ────────────────────────────────────────────────────────

  /// Add a new crop listing (authenticated users only; status starts as pending).
  public shared ({ caller }) func addCrop(crop : CropInput) : async CropId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can add crops");
    };
    cropIdCounter += 1;
    let newCrop : Crop = {
      id = cropIdCounter;
      cropName = crop.cropName;
      quantity = crop.quantity;
      price = crop.price;
      description = crop.description;
      farmerName = crop.farmerName;
      farmerPhone = crop.farmerPhone;
      imageUrl = crop.image;
      status = #pending;
      farmerPrincipal = caller;
      createdAt = Time.now();
    };
    crops.add(cropIdCounter, newCrop);
    cropIdCounter;
  };

  /// Edit an existing crop listing. Only the farmer who owns it may edit it.
  public shared ({ caller }) func editCrop(cropId : CropId, crop : CropInput) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can edit crops");
    };
    switch (crops.get(cropId)) {
      case (null) { Runtime.trap("Crop not found") };
      case (?existing) {
        if (existing.farmerPrincipal != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: You can only edit your own crop listings");
        };
        let updated : Crop = {
          existing with
          cropName = crop.cropName;
          quantity = crop.quantity;
          price = crop.price;
          description = crop.description;
          farmerName = crop.farmerName;
          farmerPhone = crop.farmerPhone;
          imageUrl = crop.image;
          // Reset to pending when edited so admin re-approves.
          status = #pending;
        };
        crops.add(cropId, updated);
      };
    };
  };

  /// Delete a crop listing. Only the owning farmer or an admin may delete it.
  public shared ({ caller }) func deleteCrop(cropId : CropId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can delete crops");
    };
    switch (crops.get(cropId)) {
      case (null) { Runtime.trap("Crop not found") };
      case (?existing) {
        if (existing.farmerPrincipal != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: You can only delete your own crop listings");
        };
        crops.remove(cropId);
      };
    };
  };

  /// Approve a crop listing (admin only).
  public shared ({ caller }) func approveCrop(cropId : CropId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can approve crops");
    };
    switch (crops.get(cropId)) {
      case (null) { Runtime.trap("Crop not found") };
      case (?crop) {
        crops.add(cropId, { crop with status = #approved });
      };
    };
  };

  /// Reject a crop listing (admin only).
  public shared ({ caller }) func rejectCrop(cropId : CropId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can reject crops");
    };
    switch (crops.get(cropId)) {
      case (null) { Runtime.trap("Crop not found") };
      case (?crop) {
        crops.add(cropId, { crop with status = #rejected });
      };
    };
  };

  // ── Order management ───────────────────────────────────────────────────────

  /// Place an order request for an approved crop (authenticated users only).
  public shared ({ caller }) func placeOrder(cropId : CropId, buyerName : Text, buyerPhone : Text, message : Text) : async OrderId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can place orders");
    };
    switch (crops.get(cropId)) {
      case (null) { Runtime.trap("Crop not found") };
      case (?crop) {
        if (crop.status != #approved) {
          Runtime.trap("Cannot order a crop that is not approved");
        };
      };
    };
    orderIdCounter += 1;
    let order : Order = {
      id = orderIdCounter;
      cropId;
      buyerPrincipal = caller;
      buyerName;
      buyerPhone;
      message;
      status = #pending;
      createdAt = Time.now();
    };
    orders.add(orderIdCounter, order);
    orderIdCounter;
  };

  /// Update the status of an order. Only the farmer who owns the crop or an
  /// admin may accept/reject an order.
  public shared ({ caller }) func updateOrderStatus(orderId : OrderId, status : OrderStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update orders");
    };
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        // Verify caller is the farmer of the crop or an admin.
        switch (crops.get(order.cropId)) {
          case (null) { Runtime.trap("Associated crop not found") };
          case (?crop) {
            if (crop.farmerPrincipal != caller and not AccessControl.isAdmin(accessControlState, caller)) {
              Runtime.trap("Unauthorized: Only the crop owner or an admin can update order status");
            };
          };
        };
        orders.add(orderId, { order with status });
      };
    };
  };

  // ── Notice management ──────────────────────────────────────────────────────

  /// Add a notice (admin only).
  public shared ({ caller }) func addNotice(title : Text, content : Text, postedBy : Text) : async NoticeId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add notices");
    };
    noticeIdCounter += 1;
    let notice : Notice = {
      id = noticeIdCounter;
      title;
      content;
      createdAt = Time.now();
      postedBy;
    };
    notices.add(noticeIdCounter, notice);
    noticeIdCounter;
  };

  /// Delete a notice (admin only).
  public shared ({ caller }) func deleteNotice(noticeId : NoticeId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete notices");
    };
    switch (notices.get(noticeId)) {
      case (null) { Runtime.trap("Notice not found") };
      case (_) { notices.remove(noticeId) };
    };
  };

  // ── Gallery management ─────────────────────────────────────────────────────

  /// Add a gallery item (admin only).
  public shared ({ caller }) func addGalleryItem(imageUrl : Text, caption : Text) : async GalleryId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add gallery items");
    };
    galleryIdCounter += 1;
    let galleryItem : GalleryItem = {
      id = galleryIdCounter;
      imageUrl;
      caption;
      createdAt = Time.now();
    };
    gallery.add(galleryIdCounter, galleryItem);
    galleryIdCounter;
  };

  /// Delete a gallery item (admin only).
  public shared ({ caller }) func deleteGalleryItem(galleryId : GalleryId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete gallery items");
    };
    switch (gallery.get(galleryId)) {
      case (null) { Runtime.trap("Gallery item not found") };
      case (_) { gallery.remove(galleryId) };
    };
  };

  // ── Contact inquiries ──────────────────────────────────────────────────────

  /// Submit a contact inquiry. Open to everyone including guests — no auth
  /// check required so that anonymous visitors can also reach out.
  public shared ({ caller }) func submitContactInquiry(name : Text, phone : Text, email : ?Text, message : Text) : async InquiryId {
    inquiryIdCounter += 1;
    let inquiry : ContactInquiry = {
      id = inquiryIdCounter;
      name;
      phone;
      email;
      message;
      createdAt = Time.now();
    };
    contactInquiries.add(inquiryIdCounter, inquiry);
    inquiryIdCounter;
  };

  // ── Public query functions ─────────────────────────────────────────────────

  /// Return all approved crop listings (public, no auth required).
  public query func getAllApprovedCrops() : async [Crop] {
    crops.values().toArray().filter(func(crop : Crop) : Bool { crop.status == #approved });
  };

  /// Return all notices in reverse chronological order (public, no auth required).
  public query func getAllNotices() : async [Notice] {
    let arr = notices.values().toArray();
    arr.sort(func(a, b) { Int.compare(b.createdAt, a.createdAt) });
  };

  /// Return all gallery items (public, no auth required).
  public query func getAllGalleryItems() : async [GalleryItem] {
    gallery.values().toArray();
  };

  /// Return a single crop by ID. Pending/rejected crops are only visible to
  /// the owning farmer or an admin.
  public query ({ caller }) func getCropById(cropId : CropId) : async ?Crop {
    switch (crops.get(cropId)) {
      case (null) { null };
      case (?crop) {
        if (crop.status == #approved) {
          ?crop;
        } else if (crop.farmerPrincipal == caller or AccessControl.isAdmin(accessControlState, caller)) {
          ?crop;
        } else {
          null;
        };
      };
    };
  };

  // ── Authenticated farmer queries ───────────────────────────────────────────

  /// Return all crops belonging to the calling farmer.
  public query ({ caller }) func getMyCrops() : async [Crop] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view their crops");
    };
    crops.values().toArray().filter(func(crop : Crop) : Bool {
      crop.farmerPrincipal == caller;
    });
  };

  /// Return all orders placed by the calling buyer.
  public query ({ caller }) func getMyOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view their orders");
    };
    orders.values().toArray().filter(func(order : Order) : Bool {
      order.buyerPrincipal == caller;
    });
  };

  /// Return all orders for crops owned by the calling farmer.
  public query ({ caller }) func getOrdersForMycrops() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view orders for their crops");
    };
    let myFarmerCropIds = Set.empty<CropId>();
    for (crop in crops.values()) {
      if (crop.farmerPrincipal == caller) {
        myFarmerCropIds.add(crop.id);
      };
    };
    orders.values().toArray().filter(func(order : Order) : Bool {
      myFarmerCropIds.contains(order.cropId);
    });
  };

  // ── Admin-only query functions ─────────────────────────────────────────────

  /// Return all crops regardless of status (admin only).
  public query ({ caller }) func getAllCrops() : async [Crop] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all crops");
    };
    crops.values().toArray();
  };

  /// Return all pending crops (admin only).
  public query ({ caller }) func getPendingCrops() : async [Crop] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view pending crops");
    };
    crops.values().toArray().filter(func(crop : Crop) : Bool { crop.status == #pending });
  };

  /// Return all registered users (admin only).
  public query ({ caller }) func getAllUsers() : async [User] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all users");
    };
    usersByPrincipal.values().toArray();
  };

  /// Return all orders (admin only).
  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.values().toArray();
  };

  /// Return all contact inquiries (admin only).
  public query ({ caller }) func getAllContactInquiries() : async [ContactInquiry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view contact inquiries");
    };
    contactInquiries.values().toArray();
  };
};


