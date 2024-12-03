import React from "react";
import {
  FaHome,
  FaCalendarAlt,
  FaUser,
  FaSuitcase,
  FaComments,
  FaUsers,
  FaBan,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import "./Sidebar.css";

export default function Sidebar() {
  return (
    <aside
      className="w-1/5 bg-gray-50 p-6 flex flex-col justify-between shadow-lg"
      style={{ minHeight: "100vh" }}
    >
      <div>
        <div className="flex items-center mb-6">
          <img
            src={`${process.env.PUBLIC_URL}/logo.svg`}
            alt="Logo"
            className="mr-2"
          />
          <h1 className="text-2xl font-semibold">StudentPlanner</h1>
        </div>

        <form className="max-w-md mx-auto">
          <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>
            </div>
            <input type="search" id="default-search" className="block w-full p-4 ps-12 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Rechercher..." required />
          </div>
        </form>

        <Navbar expand="lg" className="flex-column p-0">
          <Nav className="flex-column w-full">
            <Nav.Link
              as={NavLink}
              to="/"
              className="flex items-center p-2 mb-4"
            >
              <FaHome className="mr-2" /> Accueil
            </Nav.Link>
            <NavDropdown
              title={
                <div className="flex items-center justify-between w-full">
                  <span className="flex items-center">
                    <FaCalendarAlt className="mr-2" /> Plannings
                  </span>
                </div>
              }
              id="nav-dropdown"
              className="w-full text-left mb-4 custom-dropdown"
            >
              <NavDropdown.Item
                as={NavLink}
                to="/plannings/scolaire"
                className="flex items-center p-2"
              >
                <FaCalendarAlt className="mr-2" /> Scolaire
              </NavDropdown.Item>
              <NavDropdown.Item
                as={NavLink}
                to="/plannings/personnel"
                className="flex items-center p-2"
              >
                <FaUser className="mr-2" /> Personnel
              </NavDropdown.Item>
              <NavDropdown.Item
                as={NavLink}
                to="/plannings/professionnel"
                className="flex items-center p-2"
              >
                <FaSuitcase className="mr-2" /> Professionnel
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown
              title={
                <div className="flex items-center justify-between w-full">
                  <span className="flex items-center">
                    <FaUser className="mr-2" /> Ma classe
                  </span>
                </div>
              }
              id="nav-dropdown-class"
              className="w-full text-left mb-4 custom-dropdown"
            >
              <NavDropdown.Item
                as={NavLink}
                to="/class/chat"
                className="flex items-center p-2"
              >
                <FaComments className="mr-2" /> Chat
              </NavDropdown.Item>
              <NavDropdown.Item
                as={NavLink}
                to="/class/members"
                className="flex items-center p-2"
              >
                <FaUsers className="mr-2" /> Membres
              </NavDropdown.Item>
              <NavDropdown.Item className="flex items-center p-2" disabled>
                <FaBan className="mr-2" /> Personnel
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar>
      </div>
      <div className="mt-6">
        <hr />
        <div className="px-4 py-2">
          <div className="flex items-center">
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
        </div>
      </div>
    </aside>
  );
}
