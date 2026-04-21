import { useState, useEffect } from "react";
import auth, { getCurrentUser, loginWithGoogle } from "../lib/auth";

export interface AuthUser {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
    avatar_url?: string;
  };
  jwt(): Promise<string>;
  logout(): Promise<void>;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // GoTrue auto-processes the Google redirect token from the URL hash on load
    // so currentUser() will already be populated when user returns from Google
    const currentUser = getCurrentUser();
    setUser(currentUser as AuthUser | null);
    setLoading(false);
  }, []);

  const handleLogout = async () => {
    await auth.currentUser()?.logout();
    setUser(null);
  };

  return {
    user,
    loading,
    loginWithGoogle,
    logout: handleLogout,
    getToken: () => auth.currentUser()?.jwt(),
  };
}
