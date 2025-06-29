import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { NotificationProvider } from "./context/NotificationContext";
import Dashboard from "./components/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LandingPage from "./pages/LandingPage";
import { createTheme, Flowbite } from "flowbite-react";

import "./App.css";

const customTheme = createTheme({
  button: {
    base: "inline-flex items-center justify-center rounded-md font-medium transition-colors",
    color: {
      default: "text-white bg-indigo-600 enabled:hover:bg-indigo-700",
    },
  },
  navbar: {
    link: {
      base: "text-gray-700 enabled:hover:text-indigo-600 hover:text-indigo-600",
    },
  },
  floatingLabel: {
    base: "relative",
    input: {
      default: {
        filled: {
          input: "border-gray-300 focus:border-blue-500",
          floating: "text-gray-500 peer-focus:text-blue-500",
        },
        outlined: {
          input: "border-gray-300 focus:border-blue-500",
          floating: "text-gray-500 peer-focus:text-blue-500",
        },
      },
    },
  },
});

function App() {
  return (
    <UserProvider>
      <Flowbite theme={{ theme: customTheme, mode: "light" }}>
        <NotificationProvider>
          <Router>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard/*" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </Router>
        </NotificationProvider>
      </Flowbite>
    </UserProvider>
  );
}

export default App;
