import SignUpForm from "./components/SignUpForm/SignUpForm";
import LogInForm from "./components/LogInForm/LogInForm";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Home from "./pages/Home/Home";
import { useState } from "react";
import AuthContext, { AuthContextProvider } from "./store/AuthContext";
import TextEditor from "./pages/Editor/TextEditor";
import { UIContextProvider } from "./store/UIContext";

function App() {
  const router = createBrowserRouter([
    { path: "/", element: <Navigate to={`/signup`} />, exact: true },
    { path: "/signup", element: <SignUpForm /> },
    { path: "/login", element: <LogInForm /> },
    { path: "/home", element: <Home /> },
    { path: "/documents/:id", element: <TextEditor /> },
  ]);

  return (
    <AuthContextProvider>
      <UIContextProvider>
        <RouterProvider router={router} />
      </UIContextProvider>
    </AuthContextProvider>
  );
}

export default App;
