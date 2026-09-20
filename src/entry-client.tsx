import { createRoot, hydrateRoot } from "react-dom/client";
// Self-hosted variable fonts: same-origin, cacheable, no blocking third-party CSS. The Latin
// subsets are preloaded by the tfm-seo Vite plugin; other unicode ranges load only if needed.
import "@fontsource-variable/inter/wght.css";
import "@fontsource-variable/space-grotesk/wght.css";
import App from "./App.tsx";
import "./index.css";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root element #root not found");
}

const app = <App />;

if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
