import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayer from "./layers/MainLayer";
import HomePage from "./pages/HomePage";
import Login from "./pages/user/Login";
import Fragrances from "./pages/Fragrances";
import FragranceDetails from "./pages/FragranceDetails";
import AboutUs from "./pages/AboutUs";
import Register from "./pages/user/Register";
import NotFound from "./pages/NotFound";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "./context/AuthProvider";
import { CurrUserProvider } from "./context/CurrUserProvider";
import UserFragrances from "./pages/user/UserFragrances";
import ProfilePage from "./pages/user/ProfilePage";
import AdminRequiredLayer from "./layers/AdminRequiredLayer";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import { AdminNotes } from "./pages/Admin/Admin Note Block/AdminNote";
import { AdminManufacturer } from "./pages/Admin/Admin Manufacturer Block/AdminManufacturer";
import AdminParfumer from "./pages/Admin/Admin Parfumer Block/AdminPafrumer";
import AdminUser from "./pages/Admin/Admin User Block/AdminUser";
import AdminFragrance from "./pages/Admin/Admin Fragrance Block/AdminFragrance";
import Recommend from "./pages/user/Recommend";
import RecommendedFragrances from "./pages/user/RecommendedFragrances";

const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    element: <MainLayer />,
    children: [
      {
        path: "/*",
        element: <NotFound />,
      },
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/fragrances",
        element: <Fragrances />,
      },
      {
        path: "/fragrances/:id",
        element: <FragranceDetails />,
      },
      {
        path: "/about-us",
        element: <AboutUs />,
      },
      { path: "/user-profile", element: <ProfilePage /> },
      { path: "/user-fragrances", element: <UserFragrances /> },
      { path: "/recommend", element: <Recommend /> },
      { path: "/recommend-fragrances", element: <RecommendedFragrances /> },
      {
        element: <AdminRequiredLayer />,
        children: [
          {
            path: "/admin-dashboard",
            element: <AdminDashboard />,
          },
          {
            path: "/admin-dashboard/fragrance",
            element: <AdminFragrance />,
          },
          {
            path: "/admin-dashboard/note",
            element: <AdminNotes />,
          },
          {
            path: "/admin-dashboard/manufacturer",
            element: <AdminManufacturer />,
          },
          {
            path: "/admin-dashboard/parfumer",
            element: <AdminParfumer />,
          },
          {
            path: "/admin-dashboard/user",
            element: <AdminUser />,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CurrUserProvider>
          <RouterProvider router={router} />
        </CurrUserProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
