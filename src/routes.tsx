import type { RouteObject } from "react-router";
import { Home } from "./shell/Home";
import { NotFound } from "./shell/NotFound";
import { PatternPage } from "./shell/PatternPage";
import { Shell } from "./shell/Shell";

/*
  One route serves every pattern. The registry supplies the content, so a new pattern
  folder becomes a working URL without touching this file.
*/
export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Shell />,
    children: [
      { index: true, element: <Home /> },
      { path: ":category/:slug", element: <PatternPage /> },
      { path: "*", element: <NotFound /> },
    ],
  },
];
