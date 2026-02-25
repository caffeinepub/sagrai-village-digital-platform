import React from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from './AuthProvider';
import { LogIn, LogOut, User } from 'lucide-react';

export default function LoginButton() {
  const { login, clear, loginStatus } = useInternetIdentity();
  const { isAuthenticated, userProfile } = useAuth();
  const queryClient = useQueryClient();
  const isLoggingIn = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        if (error?.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  if (isAuthenticated && userProfile) {
    return (
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white text-sm">
          <User size={14} />
          <span className="max-w-[100px] truncate">{userProfile.name}</span>
        </div>
        <button
          onClick={handleAuth}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors"
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleAuth}
      disabled={isLoggingIn}
      className="flex items-center gap-1.5 px-4 py-2 rounded-full font-medium text-sm transition-all disabled:opacity-60"
      style={{ background: 'oklch(0.72 0.18 55)', color: 'white' }}
    >
      {isLoggingIn ? (
        <><span className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />Logging in...</>
      ) : (
        <><LogIn size={14} />Login</>
      )}
    </button>
  );
}
