import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayer from "./layers/MainLayer";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Fragrances from "./pages/Fragrances";
import FragranceDetails from "./pages/FragranceDetails";
import AboutUs from "./pages/AboutUs";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "./context/AuthProvider";
import { CurrUserProvider } from "./context/CurrUserProvider";

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
