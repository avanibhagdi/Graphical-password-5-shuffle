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

const CryptoJS = require("crypto-js");
const SECRET_KEY = "your16bytekey123"; 
const IV = "16byteinitvector"; 

function decryptUrlParams(encryptedData) {
  try {
      // Decode Base64
      let encryptedBytes = CryptoJS.enc.Base64.parse(encryptedData);

      // Decrypt using AES-CBC
      let decrypted = CryptoJS.AES.decrypt(
          { ciphertext: encryptedBytes },
          CryptoJS.enc.Utf8.parse(SECRET_KEY),
          {
              iv: CryptoJS.enc.Utf8.parse(IV),
              mode: CryptoJS.mode.CBC,
              padding: CryptoJS.pad.Pkcs7, // Ensure PKCS7 padding
          }
      );

      // Convert to string
      let decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedText); // Convert back to JSON object
  } catch (error) {
      console.error("Decryption failed:", error);
      return null;
  }
}

const url = new URL(window.location.href);
const searchParamsEnc = (url.search).slice(1);
let decryptedData = decryptUrlParams(searchParamsEnc);

const name = decryptedData["name"];
localStorage.setItem("name", name);

const recall = decryptedData["recall"]; 
localStorage.setItem("recall", recall);

const attempt = decryptedData["attempt"]; 
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
