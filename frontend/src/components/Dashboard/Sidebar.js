import React, { useState } from "react";
import { Icon } from "@iconify-icon/react";
import { NavLink, useNavigate } from "react-router-dom";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";

export default function Sidebar({ name, lastname, email }) {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/events/search?query=${searchQuery}`);
  };

  return (
    <aside
      className="w-full md:w-1/5 bg-gray-50 p-6 flex flex-col justify-between shadow-lg"
      style={{ minHeight: "100vh" }}
    >
      <div>
        <div className="flex items-center mb-6">
          <img
            src={`${process.env.PUBLIC_URL}/logo.svg`}
            alt="Logo"
            className="mr-2"
          />
          <h1 className="text-2xl font-semibold whitespace-nowrap overflow-hidden text-ellipsis">StudentPlanner</h1>
        </div>

        <form className="max-w-md mx-auto" onSubmit={handleSearchSubmit}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              required
            />
          </div>
        </form>

        <Navbar expand="lg" className="flex-column p-0">
          <Nav className="flex-column w-full">
            <Nav.Link
              as={NavLink}
              to="/"
              className="flex items-center p-2 mb-4"
            >
              <Icon icon="tabler:home" width="20" height="20" className="mr-2" /> Accueil
            </Nav.Link>
            <NavDropdown
              title={
                <div className="flex items-center justify-between w-full">
                  <span className="flex items-center">
                    <Icon icon="tabler:calendar-week" width="20" height="20" className="mr-2" /> Plannings
                  </span>
                </div>
              }
              id="nav-dropdown"
              className="w-full text-left mb-4"
            >
              <NavDropdown.Item
                as={NavLink}
                to="/plannings/scolaire"
                className="flex items-center p-2"
              >
                <Icon icon="tabler:school" className="mr-2" /> Scolaire
              </NavDropdown.Item>
              <NavDropdown.Item
                as={NavLink}
                to="/plannings/personnel"
                className="flex items-center p-2"
              >
                <Icon icon="tabler:user" className="mr-2" /> Personnel
              </NavDropdown.Item>
              <NavDropdown.Item
                as={NavLink}
                to="/plannings/professionnel"
                className="flex items-center p-2"
              >
                <Icon icon="tabler:briefcase" className="mr-2" /> Professionnel
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown
              title={
                <div className="flex items-center justify-between w-full">
                  <span className="flex items-center">
                    <Icon icon="tabler:school" width="20" height="20" className="mr-2" /> Ma classe
                  </span>
                </div>
              }
              id="nav-dropdown-class"
              className="w-full text-left mb-4"
            >
              <NavDropdown.Item
                as={NavLink}
                to="/class/chat"
                className="flex items-center p-2"
              >
                <Icon icon="tabler:messages" className="mr-2" /> Chat
              </NavDropdown.Item>
              <NavDropdown.Item
                as={NavLink}
                to="/class/members"
                className="flex items-center p-2"
              >
                <Icon icon="tabler:users" className="mr-2" /> Membres
              </NavDropdown.Item>
              <NavDropdown.Item className="flex items-center p-2" disabled>
                <Icon icon="tabler:ban" className="mr-2" /> Personnel
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar>
      </div>
      <div className="mt-6">
        <Nav.Link
          as={NavLink}
          to="/settings"
          className="flex items-center p-2 mb-4"
        >
          <Icon icon="tabler:settings" width="20" height="20" className="mr-2" /> Paramètres
        </Nav.Link>
        <Nav.Link
          as={NavLink}
          to="/support"
          className="flex items-center p-2 mb-4"
        >
          <Icon icon="tabler:lifebuoy" width="20" height="20" className="mr-2" /> Assistance
        </Nav.Link>
        <hr />
        <div className="px-4 py-2">
          <div className="flex items-center">
            <img
              src="https://via.placeholder.com/40"
              alt="Profile"
              className="rounded-full mr-4 border border-gray-300"
            />
            <div>
              <p className="font-semibold">{name} {lastname}</p>
              <p className="text-sm text-gray-500">{email}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}