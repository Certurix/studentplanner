import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { NotificationProvider } from "./context/NotificationContext";
import Dashboard from "./components/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Flowbite } from "flowbite-react";

import "./App.css";

// Define custom theme (optional)
const flowbiteTheme = {
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
};

function App() {
  return (
    <UserProvider>
      <Flowbite theme={{ theme: flowbiteTheme }}>
        <NotificationProvider>
          <Router>
            <Routes>
              <Route path="*" element={<Dashboard />} />
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
