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
        <input
          type="text"
          placeholder="Rechercher"
          className="w-full p-2 mb-6 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
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
