import React from "react";
import ReactDOM from "react-dom/client";

import App from "./app/App";
import Providers from "./app/providers";

// ✅ THIS LINE WAS MISSING
import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Providers>
      <App />
    </Providers>
  </React.StrictMode>
);
