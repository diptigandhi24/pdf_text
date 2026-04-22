import GoTrue from "gotrue-js";
import { jwtDecode } from "jwt-decode";

const SITE_URL = "https://sgnp-english-pdf-shared-notes.netlify.app";
const IDENTITY_URL = `${SITE_URL}/.netlify/identity`;

const auth = new GoTrue({
  APIUrl: IDENTITY_URL,
  audience: "",
  setCookie: true,
});

// Call this on page load — processes the access_token from URL hash
// after Google OAuth redirect and saves user to localStorage
export const handleAuthCallback = (): boolean => {
  const hash = window.location.hash;
  if (!hash.includes("access_token")) return false;

  const hashParams = new URLSearchParams(hash.substring(1));
  const accessToken = hashParams.get("access_token");
  if (!accessToken) return false;

  try {
    const userData = jwtDecode<any>(accessToken);

    const userObject = {
      url: IDENTITY_URL,
      token: {
        access_token: accessToken,
        token_type: "bearer",
        expires_in: 3600,
        expires_at: userData.exp * 1000,
      },
      id: userData.sub,
      email: userData.email,
      app_metadata: userData.app_metadata || {},
      user_metadata: userData.user_metadata || {},
      created_at: userData.iat,
      updated_at: userData.iat,
    };

    // This is what GoTrue reads — saving here makes currentUser() work
    localStorage.setItem("gotrue.user", JSON.stringify(userObject));

    // Clean the hash from the URL
    window.history.replaceState({}, document.title, window.location.pathname);

    return true;
  } catch (e) {
    console.error("Failed to process auth callback:", e);
    return false;
  }
};

export const loginWithGoogle = () => {
  window.location.assign(
    `${SITE_URL}/.netlify/identity/authorize?provider=google&redirect_to=${encodeURIComponent(window.location.origin)}`,
  );
};

export const getCurrentUser = () => auth.currentUser();

export const logout = async () => {
  await auth.currentUser()?.logout();
  localStorage.removeItem("gotrue.user");
};

export const getToken = () => auth.currentUser()?.jwt();

export default auth;
