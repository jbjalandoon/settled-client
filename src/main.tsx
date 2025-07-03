import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { ClipLoader } from "react-spinners";

import { routeTree } from "./routeTree.gen";
import { Provider } from "react-redux";
import { store } from "./app/store";
import Socket from "./context/Socket";

// Create a new router instance
const router = createRouter({
  routeTree,
  defaultPendingComponent: () => (
    <div className="flex h-screen w-screen items-center justify-center text-4xl text-white">
      <ClipLoader
        color="#ffffff"
        cssOverride={{
          borderWidth: "6px",
          borderRadius: "100%",
        }}
      />
    </div>
  ),
  defaultErrorComponent: () => (
    <div className="flex h-screen w-screen items-center justify-center text-4xl">
      <p>Something went wrong, Please refresh the page</p>
    </div>
  ),
});
// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <Provider store={store}>
        <Socket>
          <RouterProvider router={router} />
        </Socket>
      </Provider>
    </StrictMode>,
  );
}
