import GoTrue from "gotrue-js";

// Always point to production Identity URL
// netlify dev proxies this correctly to localhost
const SITE_URL = "https://sgnp-english-pdf-shared-notes.netlify.app";
const IDENTITY_URL = `${SITE_URL}/.netlify/identity`;

const auth = new GoTrue({
  APIUrl: IDENTITY_URL,
  audience: "",
  setCookie: true,
});

export const loginWithGoogle = () => {
  // When running via netlify dev, window.location.origin = http://localhost:8888
  // Netlify dev handles the redirect back to localhost correctly
  const redirectTo = window.location.origin;
  const url = `${SITE_URL}/.netlify/identity/authorize?provider=google&redirect_to=${encodeURIComponent(redirectTo)}`;
  console.log("Redirecting to:", url);
  //   window.location.assign(url);
};

export const getCurrentUser = () => auth.currentUser();

export const logout = async () => {
  const user = auth.currentUser();
  if (user) {
    await user.logout();
  }
};

export const getToken = async (): Promise<string | null> => {
  const user = auth.currentUser();
  if (!user) return null;
  return user.jwt();
};

export default auth;
