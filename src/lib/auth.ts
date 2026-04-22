import GoTrue from "gotrue-js";

const SITE_URL = "https://sgnp-english-pdf-shared-notes.netlify.app";

const auth = new GoTrue({
  APIUrl: `${SITE_URL}/.netlify/identity`,
  audience: "",
  setCookie: true,
});

export const loginWithGoogle = () => {
  const redirectTo = window.location.origin;
  window.location.assign(
    `${SITE_URL}/.netlify/identity/authorize?provider=google&redirect_to=${encodeURIComponent(redirectTo)}`,
  );
};

export const getCurrentUser = () => auth.currentUser();

export const logout = async () => {
  await auth.currentUser()?.logout();
};

export const getToken = () => auth.currentUser()?.jwt();

export default auth;
