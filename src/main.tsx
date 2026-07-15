import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import PetCentral from "./pages/PetCentral.tsx";
import QuickRef from "./pages/QuickRef.tsx";
import PetPage from "./pages/PetPage.tsx";
import CreatePet from "./pages/CreatePet.tsx";
import ComingSoon from "./pages/ComingSoon.tsx";
import { navItems } from "./data/nav.ts";
import "./index.css";

// Nav destinations that have a real page yet. Everything else in the nav falls
// back to a walkable "coming soon" stub, so the whole skeleton stays navigable.
const REAL_PAGES = new Set(["/addpet"]);

const stubRoutes = navItems
  .filter((item) => item.to !== "/" && !REAL_PAGES.has(item.to))
  .map((item) => ({ path: item.to.slice(1), element: <ComingSoon /> }));

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <PetCentral /> },
      { path: "quickref", element: <QuickRef /> },
      { path: "pet/:petId", element: <PetPage /> },
      { path: "addpet", element: <CreatePet /> },
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
