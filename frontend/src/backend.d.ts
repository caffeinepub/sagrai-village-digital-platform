import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface ContactInquiry {
    id: InquiryId;
    name: string;
    createdAt: Time;
    email?: string;
    message: string;
    phone: string;
}
export type Time = bigint;
export type GalleryId = number;
export interface User {
    id: UserId;
    principal: Principal;
    name: string;
    createdAt: Time;
    role: Role;
    phone: string;
}
export interface Crop {
    id: CropId;
    status: CropStatus;
    createdAt: Time;
    farmerPrincipal: Principal;
    description: string;
    imageUrl: ExternalBlob;
    quantity: bigint;
    cropName: string;
    price: bigint;
    farmerPhone: string;
    farmerName: string;
}
export interface Order {
    id: OrderId;
    status: OrderStatus;
    createdAt: Time;
    buyerPhone: string;
    cropId: CropId;
    message: string;
    buyerPrincipal: Principal;
    buyerName: string;
}
export type UserId = number;
export type InquiryId = number;
export type CropId = number;
export interface CropInput {
    description: string;
    quantity: bigint;
    cropName: string;
    image: ExternalBlob;
    price: bigint;
    farmerPhone: string;
    farmerName: string;
}
export interface Notice {
    id: NoticeId;
    title: string;
    postedBy: string;
    content: string;
    createdAt: Time;
}
export interface GalleryItem {
    id: GalleryId;
    createdAt: Time;
    imageUrl: string;
    caption: string;
}
export type NoticeId = number;
export type OrderId = number;
export interface UserProfile {
    name: string;
    createdAt: Time;
    role: Role;
    phone: string;
}
export enum CropStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum OrderStatus {
    pending = "pending",
    rejected = "rejected",
    accepted = "accepted"
}
export enum Role {
    admin = "admin",
    buyer = "buyer",
    farmer = "farmer"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    /**
     * / Add a new crop listing (authenticated users only; status starts as pending).
     */
    addCrop(crop: CropInput): Promise<CropId>;
    /**
     * / Add a gallery item (admin only).
     */
    addGalleryItem(imageUrl: string, caption: string): Promise<GalleryId>;
    /**
     * / Add a notice (admin only).
     */
    addNotice(title: string, content: string, postedBy: string): Promise<NoticeId>;
    /**
     * / Approve a crop listing (admin only).
     */
    approveCrop(cropId: CropId): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    /**
     * / Delete a crop listing. Only the owning farmer or an admin may delete it.
     */
    deleteCrop(cropId: CropId): Promise<void>;
    /**
     * / Delete a gallery item (admin only).
     */
    deleteGalleryItem(galleryId: GalleryId): Promise<void>;
    /**
     * / Delete a notice (admin only).
     */
    deleteNotice(noticeId: NoticeId): Promise<void>;
    /**
     * / Edit an existing crop listing. Only the farmer who owns it may edit it.
     */
    editCrop(cropId: CropId, crop: CropInput): Promise<void>;
    /**
     * / Return all approved crop listings (public, no auth required).
     */
    getAllApprovedCrops(): Promise<Array<Crop>>;
    /**
     * / Return all contact inquiries (admin only).
     */
    getAllContactInquiries(): Promise<Array<ContactInquiry>>;
    /**
     * / Return all crops regardless of status (admin only).
     */
    getAllCrops(): Promise<Array<Crop>>;
    /**
     * / Return all gallery items (public, no auth required).
     */
    getAllGalleryItems(): Promise<Array<GalleryItem>>;
    /**
     * / Return all notices in reverse chronological order (public, no auth required).
     */
    getAllNotices(): Promise<Array<Notice>>;
    /**
     * / Return all orders (admin only).
     */
    getAllOrders(): Promise<Array<Order>>;
    /**
     * / Return all registered users (admin only).
     */
    getAllUsers(): Promise<Array<User>>;
    /**
     * / Return the profile of the calling authenticated user.
     */
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    /**
     * / Return a single crop by ID. Pending/rejected crops are only visible to
     * / the owning farmer or an admin.
     */
    getCropById(cropId: CropId): Promise<Crop | null>;
    /**
     * / Return all crops belonging to the calling farmer.
     */
    getMyCrops(): Promise<Array<Crop>>;
    /**
     * / Return all orders placed by the calling buyer.
     */
    getMyOrders(): Promise<Array<Order>>;
    /**
     * / Return all orders for crops owned by the calling farmer.
     */
    getOrdersForMycrops(): Promise<Array<Order>>;
    /**
     * / Return all pending crops (admin only).
     */
    getPendingCrops(): Promise<Array<Crop>>;
    /**
     * / Fetch another user's profile. Callers may only view their own profile
     * / unless they are an admin.
     */
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    /**
     * / Place an order request for an approved crop (authenticated users only).
     */
    placeOrder(cropId: CropId, buyerName: string, buyerPhone: string, message: string): Promise<OrderId>;
    /**
     * / Register (or update) the calling user's full record.
     */
    registerUser(name: string, phone: string, role: Role): Promise<number>;
    /**
     * / Reject a crop listing (admin only).
     */
    rejectCrop(cropId: CropId): Promise<void>;
    /**
     * / Persist (create or update) the profile of the calling authenticated user.
     */
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    /**
     * / Submit a contact inquiry. Open to everyone including guests — no auth
     * / check required so that anonymous visitors can also reach out.
     */
    submitContactInquiry(name: string, phone: string, email: string | null, message: string): Promise<InquiryId>;
    /**
     * / Update the status of an order. Only the farmer who owns the crop or an
     * / admin may accept/reject an order.
     */
    updateOrderStatus(orderId: OrderId, status: OrderStatus): Promise<void>;
}
