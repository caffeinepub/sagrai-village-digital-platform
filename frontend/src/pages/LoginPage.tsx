import React, { useEffect } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '../components/AuthProvider';
import LoginButton from '../components/LoginButton';
import { Shield, Leaf, ShoppingCart, Bell, AlertTriangle } from 'lucide-react';

export default function LoginPage() {
  const { isAuthenticated, userProfile, profileLoading, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Read adminRequired from URL search params
  const search = useSearch({ strict: false }) as Record<string, string>;
  const fromAdmin = search?.adminRequired === 'true';

  useEffect(() => {
    if (isAuthenticated && userProfile && !profileLoading) {
      if (fromAdmin && isAdmin) {
        navigate({ to: '/admin' });
      } else if (fromAdmin && !isAdmin) {
        // Authenticated but not admin — stay on login page to show access denied message
        // (handled below in the render)
      } else {
        navigate({ to: '/' });
      }
    }
  }, [isAuthenticated, userProfile, profileLoading, isAdmin, fromAdmin, navigate]);

  // If authenticated but not admin and came from admin route, show access denied notice
  const showAccessDenied = isAuthenticated && userProfile && !profileLoading && fromAdmin && !isAdmin;

  return (
    <div className="animate-fade-in min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="/assets/generated/village-logo.dim_256x256.png"
            alt="Sagrai"
            className="w-20 h-20 rounded-full object-cover border-4 border-primary/20 mx-auto mb-4 shadow-card"
          />
          <h1 className="font-display text-3xl font-bold text-primary">Welcome to Sagrai</h1>
          <p className="text-muted-foreground mt-1">Village Digital Platform</p>
        </div>

        {/* Admin redirect notice */}
        {fromAdmin && !showAccessDenied && (
          <div className="mb-4 flex items-start gap-3 p-4 rounded-lg bg-amber-50 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-800">
            <AlertTriangle size={18} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 dark:text-amber-300">
              Admin access required. Please log in with an admin account to access the Control Panel.
            </p>
          </div>
        )}

        {/* Access denied notice for authenticated non-admin users */}
        {showAccessDenied && (
          <div className="mb-4 flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/30">
            <AlertTriangle size={18} className="text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-destructive">Access Denied</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Your account does not have admin privileges. Please contact the village administrator if you believe this is a mistake.
              </p>
            </div>
          </div>
        )}

        {/* Login Card */}
        <Card className="shadow-card border-border">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Shield size={22} className="text-primary" />
              </div>
              <h2 className="font-semibold text-foreground text-lg">Secure Login</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Use Internet Identity for secure, decentralized authentication
              </p>
            </div>

            <div className="flex justify-center mb-6">
              <LoginButton />
            </div>

            {!showAccessDenied && (
              <div className="border-t border-border pt-5">
                <p className="text-xs text-muted-foreground text-center mb-4">
                  After logging in, you'll be asked to choose your role:
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-secondary text-center">
                    <span className="text-2xl">👨‍🌾</span>
                    <p className="text-xs font-medium text-foreground">Farmer</p>
                    <p className="text-xs text-muted-foreground">List & sell crops</p>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-secondary text-center">
                    <span className="text-2xl">🛒</span>
                    <p className="text-xs font-medium text-foreground">Buyer</p>
                    <p className="text-xs text-muted-foreground">Browse & order crops</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Features */}
        {!showAccessDenied && (
          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            {[
              { icon: <Leaf size={18} className="text-primary" />, label: 'Crop Marketplace' },
              { icon: <Bell size={18} className="text-accent" />, label: 'Village Notices' },
              { icon: <ShoppingCart size={18} className="text-primary" />, label: 'Order Crops' },
            ].map((f) => (
              <div key={f.label} className="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-card border border-border">
                {f.icon}
                <p className="text-xs text-muted-foreground">{f.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
