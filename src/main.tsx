import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import "./index.css";
import { routes } from "./routes.tsx";
import { dismissSplash } from "./shell/splash";

/*
  Deliberately no <StrictMode> here, which deserves an explanation.

  StrictMode double-invokes render in development to surface impure renders. That is a
  good default for an app — but this site's central teaching device is a render counter,
  and doubling would report 2 renders where React commits 1, with development and
  production disagreeing on the exact numbers learners are asked to reason about.

  Correctness is not lost, it moves: StrictMode gets its own page in the Rendering
  section, where double-invocation is the lesson rather than noise on top of one.
*/
/*
  Keep the router aligned with Vite's asset base. The custom domain and local dev
  both use "/". React Router wants no trailing slash, hence the trim.
*/
const basename = import.meta.env.BASE_URL.replace(/\/+$/, "") || "/";

const router = createBrowserRouter(routes, { basename });

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />,
);

dismissSplash();
