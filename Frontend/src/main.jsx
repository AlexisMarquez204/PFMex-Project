import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Formulario from "./components/FormPersonalData";
import Login from "./components/Login";
import UserDashboard from "./components/UserDashboard";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/formulario",
    element: <Formulario />
  },
  {
  path: "/login",
  element: <Login />
},
{
  path: "/userDashboard",
  element: <UserDashboard />
}

]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
