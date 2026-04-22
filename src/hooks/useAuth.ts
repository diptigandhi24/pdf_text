import { useState, useEffect } from "react";
import auth, {
  getCurrentUser,
  logout,
  loginWithGoogle,
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
    const hash = window.location.hash;

    console.log("--- useAuth debug ---");
    console.log("hash:", hash);
    console.log("currentUser on mount:", getCurrentUser());

    const hasToken = hash.includes("access_token");

    if (hasToken) {
      console.log("Token found in hash, waiting for GoTrue...");

      // Try immediately first
      const immediate = getCurrentUser();
      console.log("immediate currentUser:", immediate);

      if (immediate) {
        setUser(immediate as AuthUser);
        setLoading(false);
        window.history.replaceState(null, "", window.location.pathname);
        return;
      }

      // If not ready, poll every 200ms for up to 3 seconds
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        const u = getCurrentUser();
        console.log(`attempt ${attempts}:`, u);

        if (u) {
          clearInterval(interval);
          setUser(u as AuthUser);
          setLoading(false);
          window.history.replaceState(null, "", window.location.pathname);
        }

        if (attempts >= 15) {
          console.error("GoTrue never returned a user after 3s");
          clearInterval(interval);
          setLoading(false);
        }
      }, 200);
    } else {
      const currentUser = getCurrentUser();
      console.log("no hash, currentUser from cookie:", currentUser);
      setUser(currentUser as AuthUser | null);
      setLoading(false);
    }
  }, []);

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  return { user, loading, loginWithGoogle, logout: handleLogout, getToken };
}
