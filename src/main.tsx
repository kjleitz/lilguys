import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import PetCentral from "./pages/PetCentral.tsx";
import ComingSoon from "./pages/ComingSoon.tsx";
import { navItems } from "./data/nav.ts";
import "./index.css";

// Pet Central is the index; every other nav destination is a walkable stub for
// now, so the whole skeleton is navigable while pages get built out.
const stubRoutes = navItems
  .filter((item) => item.to !== "/")
  .map((item) => ({ path: item.to.slice(1), element: <ComingSoon /> }));

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <PetCentral /> },
      ...stubRoutes,
      { path: "*", element: <ComingSoon /> },
    ],
  },
]);

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element #root not found");

createRoot(rootElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
