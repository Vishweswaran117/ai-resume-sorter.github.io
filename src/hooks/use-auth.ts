import { api } from "@/convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useQuery } from "convex/react";
import { useLocation } from "react-router";

import { useEffect, useState } from "react";

export function useAuth() {
  const { isLoading: isAuthLoading, isAuthenticated } = useConvexAuth();
  const user = useQuery(api.users.currentUser);
  const { signIn, signOut } = useAuthActions();

  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation(); // Add location to control anonymous sign-in on /auth

  // Auto sign in anonymously when not authenticated (no email required)
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated && location.pathname !== "/auth") {
      // Attempt anonymous sign-in silently (skip on /auth to allow login)
      signIn("anonymous").catch(() => {
        // Ignore errors to avoid blocking UI
      });
    }
  }, [isAuthLoading, isAuthenticated, signIn, location.pathname]);

  // This effect updates the loading state once auth is loaded and user data is available
  // It ensures we only show content when both authentication state and user data are ready
  useEffect(() => {
    if (!isAuthLoading && user !== undefined) {
      setIsLoading(false);
    }
  }, [isAuthLoading, user]);

  return {
    isLoading,
    isAuthenticated,
    user,
    signIn,
    signOut,
  };
}