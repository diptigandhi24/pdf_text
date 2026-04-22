import GoTrue from "gotrue-js";

const SITE_URL = "https://sgnp-english-pdf-shared-notes.netlify.app";
const IDENTITY_URL = `${SITE_URL}/.netlify/identity`;

const auth = new GoTrue({
  APIUrl: IDENTITY_URL,
  audience: "",
  setCookie: true,
});

export const loginWithGoogle = () => {
  // Build from SITE_URL, not IDENTITY_URL — avoids the doubled path
  window.location.href = `${SITE_URL}/.netlify/identity/authorize?provider=google&redirect_to=${window.location.origin}`;
};

export const getCurrentUser = () => auth.currentUser();

export const logout = async () => {
  await auth.currentUser()?.logout();
};

export const getToken = () => auth.currentUser()?.jwt();

export default auth;
