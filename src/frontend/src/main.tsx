import { InternetIdentityProvider } from "@caffeineai/core-infrastructure";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

BigInt.prototype.toJSON = function () {
  return this.toString();
};

declare global {
  interface BigInt {
    toJSON(): string;
  }
  interface Window {
    __ENV__?: {
      backend_host?: string;
      backend_canister_id?: string;
      project_id?: string;
      ii_derivation_origin?: string;
    };
  }
}

const queryClient = new QueryClient();

function renderApp() {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <QueryClientProvider client={queryClient}>
      <InternetIdentityProvider>
        <App />
      </InternetIdentityProvider>
    </QueryClientProvider>,
  );
}

// Fetch env.json at runtime so the Caffeine platform's deploy-time values
// (real canister IDs, host, etc.) are available before the app boots.
// Only values that are non-empty override window.__ENV__ to avoid clobbering
// anything the platform may have already set via a <script> tag.
fetch("/env.json")
  .then((res) => res.json())
  .then((env: Window["__ENV__"]) => {
    if (env && typeof env === "object") {
      window.__ENV__ = { ...window.__ENV__, ...env };
    }
  })
  .catch(() => {
    // env.json not available — continue with build-time env vars only
  })
  .finally(() => {
    renderApp();
  });
