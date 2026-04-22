import GoTrue from "gotrue-js";

const auth = new GoTrue({
  APIUrl: `${window.location.origin}/.netlify/identity`,
  audience: "",
  setCookie: true,
});

export const loginWithGoogle = () => auth.loginExternalProvider("google");

export const getCurrentUser = () => auth.currentUser();

export const logout = () => auth.currentUser()?.logout();

export const getToken = () => auth.currentUser()?.jwt();

export default auth;
