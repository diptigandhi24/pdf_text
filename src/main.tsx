import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

var global = 1;
console.log("FULL URL:", window.location.href);
console.log("HASH:", window.location.hash);
console.log("SEARCH:", window.location.search);
console.log("PATHNAME:", window.location.pathname);
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
