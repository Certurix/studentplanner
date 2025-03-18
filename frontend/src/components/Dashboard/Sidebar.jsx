import React, { useState, useEffect } from "react";
import { Icon } from "@iconify-icon/react";
import { NavLink, useNavigate } from "react-router-dom";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import useUser from "../../hooks/useUser";
import "./Sidebar.css";

export default function Sidebar({ data }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { clearUserId } = useUser();

  useEffect(() => {
    if (data && data.name && data.lastname) {
      getAvatar();
    }
  }, [data]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/events/search?query=${searchQuery}`);
  };

  function getAvatar() {
    fetch(
      `https://cors-anywhere.herokuapp.com/https://img.buymeacoffee.com/api/?name=${data.name}+${data.lastname}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.blob();
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        setAvatar(url);
      })
      .catch((error) => setError(error.message));
  }

  const handleLogout = () => {
    clearUserId();
    navigate("/login");
  };

  return (
    <aside className="w-full md:w-1/5 bg-gray-50 p-6 flex flex-col justify-between shadow-lg min-h-screen">
      <div>
        <div className="flex items-center mb-6">
          <img src={`/logo.svg`} alt="Logo StudentPlanner" className="mr-2" />
          <h1 className="text-xl font-semibold whitespace-nowrap overflow-hidden text-ellipsis font-inter">
            StudentPlanner
          </h1>
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
              className="block w-full pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={searchQuery}
              placeholder="Rechercher..."
              onChange={(e) => setSearchQuery(e.target.value)}
              required
            />
          </div>
        </form>

        <Navbar expand="lg" className="flex-column p-0">
          <Nav className="flex-column w-full">
            <Nav.Link as={NavLink} to="/" className="flex items-center mb-2">
              <Icon
                icon="tabler:home"
                width="20"
                height="20"
                className="mr-2"
              />{" "}
              Accueil
            </Nav.Link>
            <NavDropdown
              title={
                <div className="flex items-center justify-between w-full">
                  <span className="flex items-center">
                    <Icon
                      icon="tabler:calendar-week"
                      width="20"
                      height="20"
                      className="mr-2"
                    />{" "}
                    Plannings
                  </span>
                </div>
              }
              id="nav-dropdown"
              className="w-full text-left mb-2"
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
                    <Icon
                      icon="tabler:school"
                      width="20"
                      height="20"
                      className="mr-2"
                    />{" "}
                    Ma classe
                  </span>
                </div>
              }
              id="nav-dropdown-class"
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
          <Icon
            icon="tabler:settings"
            width="20"
            height="20"
            className="mr-2"
          />{" "}
          Paramètres
        </Nav.Link>
        <Nav.Link
          as={NavLink}
          to="/support"
          className="flex items-center p-2 mb-4"
        >
          <Icon
            icon="tabler:lifebuoy"
            width="20"
            height="20"
            className="mr-2"
          />{" "}
          Assistance
        </Nav.Link>
        <hr />
        <div className="px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {avatar ? (
                <img
                  src={avatar}
                  alt="profil"
                  className="w-10 h-10 rounded-full mr-4 border border-gray-300 bg-gray-200"
                />
              ) : (
                <div className="w-10 h-10 rounded-full mr-4 border border-gray-300 bg-gray-200" />
              )}
              <div>
                <p className="font-semibold">
                  {data.name} {data.lastname}
                </p>
                <p className="text-sm text-gray-500">{data.email}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="text-gray-500">
              <Icon icon="tabler:logout" width="20" height="20" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}