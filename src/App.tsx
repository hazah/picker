import { RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import router from "./router";

function App() {
  return (
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}

export default App;
