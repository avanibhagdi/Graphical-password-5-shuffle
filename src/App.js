import logo from "./logo.svg";
import "./App.css";
import Imagepassword from "./screens/image-password";
import Success from "./screens/success";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Verified from "./screens/verified";
import ErrorC from "./screens/error";
import Name from "./screens/name";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const url = new URL(window.location.href);
console.log(url.search);

const name = url.searchParams.get("name"); // example url : http://localhost:3000/?name=John
localStorage.setItem("name", name);
console.log(name);
const recall = url.searchParams.get("recall"); 
localStorage.setItem("recall", recall);
// console.log(recall);

const attempt = url.searchParams.get("attempt"); 
localStorage.setItem("attempt", attempt);
const router = createBrowserRouter([
  {
    path: "/",
    element: <Imagepassword />,
  },
  {
    path: "/ip",
    element: <Imagepassword />,
  },
  {
    path: "/success",
    element: <Success />,
  },
  {
    path: "/error",
    element: <ErrorC />,
  },
  {
    path: "/verified",
    element: <Verified />,
  },
]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
      <ToastContainer position="top-center" />
    </div>
  );
}

export default App;
