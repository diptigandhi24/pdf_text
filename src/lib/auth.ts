import GoTrue from "gotrue-js";
const SITE_URL = "https://sgnp-english-pdf-shared-notes.netlify.app";
const IDENTITY_URL = `${SITE_URL}/.netlify/identity`;
const REDIRECT_URL = window.location.origin;

const auth = new GoTrue({
  APIUrl: IDENTITY_URL,
  audience: "",
  setCookie: true,
});

// Redirect directly to Google OAuth — this is the correct GoTrue approach
export const loginWithGoogle = () => {
  const url = `${SITE_URL}/.netlify/identity/authorize?provider=google&redirect_to=${encodeURIComponent(REDIRECT_URL)}`;
  console.log("Redirecting to:", url);
  window.location.assign(REDIRECT_URL); // more reliable than setting href directly
};
export const getCurrentUser = () => auth.currentUser();

export const logout = async () => {
  await auth.currentUser()?.logout();
};

export const getToken = () => auth.currentUser()?.jwt();

export default auth;
