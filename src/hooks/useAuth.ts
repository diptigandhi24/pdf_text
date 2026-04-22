import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { getCurrentUser, loginWithGoogle, logout, getToken } from "../lib/auth";

export interface AuthUser {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
    avatar_url?: string;
  };
}

interface JwtPayload {
  sub: string;
  email: string;
  exp: number;
  iat: number;
  app_metadata: Record<string, unknown>;
  user_metadata: {
    full_name?: string;
    avatar_url?: string;
  };
}

const SITE_URL = "https://sgnp-english-pdf-shared-notes.netlify.app";
const IDENTITY_URL = `${SITE_URL}/.netlify/identity`;

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  globalThis.countEffect++;
  useEffect(() => {
    const hash = window.location.hash;
    console.log("hash exist inside useAuth", hash);
    if (hash.includes("access_token")) {
      try {
        const hashParams = new URLSearchParams(hash.substring(1));
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");

        if (!accessToken) throw new Error("No access token");

        // Decode JWT directly — no need to wait for GoTrue
        const decoded = jwtDecode<JwtPayload>(accessToken);

        // Build user object in GoTrue's expected format
        const userObject = {
          url: IDENTITY_URL,
          token: {
            access_token: accessToken,
            token_type: "bearer",
            expires_in: 3600,
            refresh_token: refreshToken,
            expires_at: decoded.exp * 1000,
          },
          id: decoded.sub,
          email: decoded.email,
          app_metadata: decoded.app_metadata || {},
          user_metadata: decoded.user_metadata || {},
          created_at: decoded.iat,
          updated_at: decoded.iat,
        };

        // Save to localStorage so GoTrue recognizes it on next load
        localStorage.setItem("gotrue.user", JSON.stringify(userObject));

        // Set user directly from decoded data — no GoTrue call needed
        setUser({
          id: decoded.sub,
          email: decoded.email,
          user_metadata: decoded.user_metadata || {},
        });

        // Clean hash from URL
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname,
        );
      } catch (e) {
        console.error("Failed to process auth token:", e);
      } finally {
        setLoading(false);
      }
    } else {
      // Returning user — read from GoTrue/localStorage
      const currentUser = getCurrentUser();
      console.log("Hook consle", currentUser);
      if (currentUser) {
        console.log(
          "yes current user exist",
          "currentUser",
          currentUser.user_metadata.full_name,
        );
        setUser({
          id: currentUser.id,
          email: currentUser.email,
          user_metadata: currentUser.user_metadata || {},
        });
      }
      setLoading(false);
    }
  }, []);

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  return { user, loading, loginWithGoogle, logout: handleLogout, getToken };
}
