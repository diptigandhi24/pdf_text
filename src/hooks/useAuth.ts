import { useState, useEffect } from "react";
import {
  getCurrentUser,
  handleAuthCallback,
  loginWithGoogle,
  logout,
  getToken,
} from "../lib/auth";

export interface AuthUser {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
    avatar_url?: string;
  };
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. If returning from Google OAuth, process the token first
    const wasCallback = handleAuthCallback();

    // 2. Now read the user — works because handleAuthCallback
    //    saved it to localStorage before this line
    const currentUser = getCurrentUser();
    console.log("Hook consle", currentUser);
    setUser(currentUser as AuthUser | null);
    setLoading(false);
  }, []);

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  return { user, loading, loginWithGoogle, logout: handleLogout, getToken };
}
