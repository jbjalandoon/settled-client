import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import Navbar from "../components/navbar/Navbar";
import { ToastContainer } from "react-toastify";
import { getGuestToken } from "../api/auth";

export const Route = createRootRoute({
  beforeLoad: async () => {
    await getGuestToken();
  },
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <Navbar />
      <ToastContainer />
      <div className="container mx-auto flex h-screen items-center justify-center">
        <Outlet />
      </div>
      <TanStackRouterDevtools />
    </>
  );
}
