import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Formulario from "./components/FormPersonalData";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/formulario",
    element: <Formulario />
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
