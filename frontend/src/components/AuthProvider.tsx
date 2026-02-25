import React, { createContext, useContext, ReactNode } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useActor } from '../hooks/useActor';
import { useQuery } from '@tanstack/react-query';
import { UserProfile, Role } from '../backend';

interface AuthContextType {
  isAuthenticated: boolean;
  userProfile: UserProfile | null;
  profileLoading: boolean;
  profileFetched: boolean;
  isAdmin: boolean;
  isFarmer: boolean;
  isBuyer: boolean;
  identity: ReturnType<typeof useInternetIdentity>['identity'];
  login: () => void;
  clear: () => void;
  loginStatus: ReturnType<typeof useInternetIdentity>['loginStatus'];
  isLoggingIn: boolean;
  refetchProfile: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { identity, login, clear, loginStatus, isLoggingIn } = useInternetIdentity();
  const { actor, isFetching: actorFetching } = useActor();
  const isAuthenticated = !!identity;

  const profileQuery = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
    retry: false,
  });

  const userProfile = profileQuery.data ?? null;
  const profileLoading = actorFetching || profileQuery.isLoading;
  const profileFetched = !!actor && profileQuery.isFetched;

  const isAdmin = userProfile?.role === Role.admin;
  const isFarmer = userProfile?.role === Role.farmer;
  const isBuyer = userProfile?.role === Role.buyer;

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      userProfile,
      profileLoading,
      profileFetched,
      isAdmin,
      isFarmer,
      isBuyer,
      identity,
      login,
      clear,
      loginStatus,
      isLoggingIn,
      refetchProfile: profileQuery.refetch,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
