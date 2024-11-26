// src/components/Sidebar.js

import { FaHome, FaCalendarAlt, FaUser } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useState } from "react";

export default function Sidebar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <aside
      className="w-1/5 bg-gray-50 p-6 flex flex-col justify-between shadow-lg"
      style={{ minHeight: "100vh" }}
    >
      <div>
        <div className="flex items-center mb-6">
          <img
            src="https://via.placeholder.com/40"
            alt="Logo"
            className="mr-2"
          />
          <h1 className="text-2xl font-semibold">StudentPlanner</h1>
        </div>
        <input
          type="text"
          placeholder="Rechercher"
          className="w-full p-2 mb-6 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <nav>
          <ul>
            <li className="flex items-center p-2 mb-4">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center text-indigo-600 font-bold"
                    : "flex items-center text-gray-600"
                }
              >
                <FaHome className="mr-2" /> Accueil
              </NavLink>
            </li>
            <li className="flex items-center p-2 mb-4 relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center w-full text-left focus:outline-none"
              >
                <FaCalendarAlt className="mr-2" /> Plannings
              </button>
              {isDropdownOpen && (
                <ul className="absolute left-0 mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10">
                  <li className="p-2 hover:bg-gray-100">
                    <NavLink
                      to="/plannings/scolaire"
                      className={({ isActive }) =>
                        isActive ? "text-indigo-600 font-bold" : "text-gray-600"
                      }
                    >
                      Scolaire
                    </NavLink>
                  </li>
                  <li className="p-2 hover:bg-gray-100">
                    <NavLink
                      to="/plannings/personnel"
                      className={({ isActive }) =>
                        isActive ? "text-indigo-600 font-bold" : "text-gray-600"
                      }
                    >
                      Personnel
                    </NavLink>
                  </li>
                  <li className="p-2 hover:bg-gray-100">
                    <NavLink
                      to="/plannings/professionnel"
                      className={({ isActive }) =>
                        isActive ? "text-indigo-600 font-bold" : "text-gray-600"
                      }
                    >
                      Professionnel
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>
            <li className="flex items-center p-2 mb-4">
              <NavLink
                to="/class"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center text-indigo-600 font-bold"
                    : "flex items-center text-gray-600"
                }
              >
                <FaUser className="mr-2" /> Ma classe
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
      <div className="flex items-center mt-6">
        <img
          src="https://via.placeholder.com/40"
          alt="Profile"
          className="rounded-full mr-4 border border-gray-300"
        />
        <div>
          <p className="font-semibold">Marc Dubois</p>
          <p className="text-sm text-gray-500">marcdubois@exemple.com</p>
        </div>
      </div>
    </aside>
  );
}
