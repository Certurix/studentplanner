import React, { useState, useEffect, useCallback, useRef } from "react";

import axios from "axios";
import { Icon } from "@iconify-icon/react";
import { NavLink, useNavigate } from "react-router-dom";
import { Sidebar } from "flowbite-react";

import useUser from "../../hooks/useUser";

export default function SidebarComponent({ data }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navigate = useNavigate();
  const { clearUserId } = useUser();
  const avatarUrlRef = useRef(null);
  const sidebarRef = useRef(null);

  // =============== Mobile sidebar management ===============

  const toggleMobileSidebar = () => {
    setIsMobileOpen((prev) => !prev);
  };

  // Close sidebar when navigation occurs on mobile
  const handleNavigation = () => {
    if (window.innerWidth < 768) {
      setIsMobileOpen(false);
    }
  };

  // Handle clicks outside sidebar to close it on mobile
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        isMobileOpen
      ) {
        setIsMobileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileOpen]);

  // =============== User avatar management ===============

  // Fetch user avatar from API
  const getAvatar = useCallback(() => {
    if (!data?.name || !data?.lastname) return;

    // Clean up previous avatar URL if exists
    if (avatarUrlRef.current) {
      URL.revokeObjectURL(avatarUrlRef.current);
      avatarUrlRef.current = null;
    }

    try {
      axios
        .get(
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            data.name
          )}+${encodeURIComponent(data.lastname)}&background=random`,
          {
            responseType: "blob", // Important for handling image data
          }
        )
        .then((response) => {
          const blob = response.data;
          const url = URL.createObjectURL(blob);
          avatarUrlRef.current = url; // Store reference for cleanup
          setAvatar(url);
        })
        .catch((error) => {
          console.error("Failed to fetch avatar:", error.message);
          // Will render placeholder instead
        });
    } catch (error) {
      console.error("Error in avatar creation:", error);
    }
  }, [data?.name, data?.lastname]);

  // Fetch avatar when user data changes
  useEffect(() => {
    if (data && data.name && data.lastname) {
      getAvatar();
    }

    // Clean up URL object when component unmounts
    return () => {
      if (avatarUrlRef.current) {
        URL.revokeObjectURL(avatarUrlRef.current);
        avatarUrlRef.current = null;
      }
    };
  }, [data, getAvatar]);

  // =============== Navigation handlers ===============

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/events/search?query=${encodeURIComponent(searchQuery)}`);
    // Close sidebar after search on mobile
    if (window.innerWidth < 768) {
      setIsMobileOpen(false);
    }
  };

  // Handle user logout
  const handleLogout = () => {
    clearUserId();
    navigate("/login");
  };

  // =============== Component rendering ===============

  // Render the search form
  const renderSearchForm = () => (
    <form onSubmit={handleSearchSubmit} className="px-0">
      <div className="relative">
        <div
          className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
          aria-hidden="true"
        >
          <svg
            className="w-4 h-4 text-gray-500"
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
          className="block w-full pl-10 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Rechercher..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          required
          aria-label="Rechercher des événements"
        />
      </div>
    </form>
  );

  // Render user profile section
  const renderUserProfile = () => (
    <div className="flex items-center space-x-2">
      {avatar ? (
        <img
          src={avatar}
          alt={`Avatar de ${data.name} ${data.lastname}`}
          className="w-10 h-10 rounded-full flex-shrink-0 border border-gray-300 bg-gray-200"
        />
      ) : (
        <div
          className="w-10 h-10 rounded-full flex-shrink-0 border border-gray-300 bg-gray-200"
          aria-label="Avatar par défaut"
        />
      )}
      <div className="min-w-0 flex-1 overflow-hidden">
        <p 
          className="font-semibold truncate"
          title={`${data.name} ${data.lastname}`}
        >
          {data.name} {data.lastname}
        </p>
        <p 
          className="text-sm text-gray-500 truncate"
          title={data.email}
        >
          {data.email}
        </p>
      </div>
      <button
        onClick={handleLogout}
        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full flex-shrink-0 transition-colors duration-200 ml-1"
        aria-label="Déconnexion"
      >
        <Icon icon="tabler:logout" width="20" height="20" />
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={toggleMobileSidebar}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-primary-600 text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        aria-label="Ouvrir menu de navigation"
        aria-expanded={isMobileOpen}
      >
        <Icon
          icon={isMobileOpen ? "tabler:x" : "tabler:menu-2"}
          width="24"
          height="24"
        />
      </button>

      {/* Backdrop overlay on mobile */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          aria-hidden="true"
        />
      )}

      {/* Sidebar component */}
      <div
        ref={sidebarRef}
        className={`fixed md:static inset-y-0 left-0 z-40 transition-transform duration-300 ease-in-out ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } w-64 md:w-1/6 flex-shrink-0`}
      >
        <Sidebar
          className="h-full min-h-screen shadow-lg flex flex-col overflow-visible"
          aria-label="Navigation principale"
        >
          <div className="flex flex-col h-full justify-between">
            {/* Top section with logo, search, and main navigation */}
            <div className="flex flex-col space-y-0">
              {/* Logo */}
              <Sidebar.Logo
                href="/"
                img="/logo.svg"
                imgAlt="StudentPlanner Logo"
                className="flex items-center py-4"
              >
                <span className="self-center text-xl font-semibold whitespace-nowrap">
                  StudentPlanner
                </span>
              </Sidebar.Logo>

              {/* Search Component */}
              {renderSearchForm()}

              {/* Main Navigation Items */}
              <Sidebar.Items>
                <Sidebar.ItemGroup className="space-y-1">
                  <Sidebar.Item
                    as={NavLink}
                    to="/"
                    icon={() => (
                      <Icon
                        icon="tabler:home"
                        className="flex-shrink-0"
                        width="20"
                        height="20"
                      />
                    )}
                    className="flex items-center py-2.5"
                    onClick={handleNavigation}
                  >
                    <span className="ml-3">Accueil</span>
                  </Sidebar.Item>

                  {/* Plannings Dropdown */}
                  <Sidebar.Collapse
                    label="Plannings"
                    icon={() => (
                      <Icon
                        icon="tabler:calendar-week"
                        className="flex-shrink-0"
                        width="20"
                        height="20"
                      />
                    )}
                    className="py-2.5"
                  >
                    <Sidebar.Item
                      as={NavLink}
                      to="/plannings/scolaire"
                      icon={() => (
                        <Icon
                          icon="tabler:school"
                          className="flex-shrink-0"
                          width="20"
                          height="20"
                        />
                      )}
                      className="pl-11 py-2"
                      onClick={handleNavigation}
                    >
                      <span className="ml-3">Scolaire</span>
                    </Sidebar.Item>
                    <Sidebar.Item
                      as={NavLink}
                      to="/plannings/personnel"
                      icon={() => (
                        <Icon
                          icon="tabler:user"
                          className="flex-shrink-0"
                          width="20"
                          height="20"
                        />
                      )}
                      className="pl-11 py-2"
                      onClick={handleNavigation}
                    >
                      <span className="ml-3">Personnel</span>
                    </Sidebar.Item>
                    <Sidebar.Item
                      as={NavLink}
                      to="/plannings/professionnel"
                      icon={() => (
                        <Icon
                          icon="tabler:briefcase"
                          className="flex-shrink-0"
                          width="20"
                          height="20"
                        />
                      )}
                      className="pl-11 py-2"
                      onClick={handleNavigation}
                    >
                      <span className="ml-3">Professionnel</span>
                    </Sidebar.Item>
                  </Sidebar.Collapse>

                  {/* Ma Classe Dropdown */}
                  <Sidebar.Collapse
                    label="Ma classe"
                    icon={() => (
                      <Icon
                        icon="tabler:school"
                        className="flex-shrink-0"
                        width="20"
                        height="20"
                      />
                    )}
                    className="py-2.5 z-50"
                  >
                    <Sidebar.Item
                      as={NavLink}
                      to="/class/chat"
                      icon={() => (
                        <Icon
                          icon="tabler:messages"
                          className="flex-shrink-0"
                          width="20"
                          height="20"
                        />
                      )}
                      className="pl-11 py-2"
                      onClick={handleNavigation}
                    >
                      <span className="ml-3">Chat</span>
                    </Sidebar.Item>
                    <Sidebar.Item
                      as={NavLink}
                      to="/class/members"
                      icon={() => (
                        <Icon
                          icon="tabler:users"
                          className="flex-shrink-0"
                          width="20"
                          height="20"
                        />
                      )}
                      className="pl-11 py-2"
                      onClick={handleNavigation}
                    >
                      <span className="ml-3">Membres</span>
                    </Sidebar.Item>
                    <Sidebar.Item
                      icon={() => (
                        <Icon
                          icon="tabler:ban"
                          className="flex-shrink-0"
                          width="20"
                          height="20"
                        />
                      )}
                      disabled
                      className="pl-11 py-2"
                    >
                      <span className="ml-3">Personnel</span>
                    </Sidebar.Item>
                  </Sidebar.Collapse>
                </Sidebar.ItemGroup>
              </Sidebar.Items>
            </div>

            {/* Bottom section with Settings, Support, and User Info */}
            <div className="mt-auto">
              {/* Settings & Support Navigation */}
              <Sidebar.ItemGroup className="space-y-1 border-t border-gray-200 pt-3">
                <Sidebar.Item
                  as={NavLink}
                  to="/settings"
                  icon={() => (
                    <Icon
                      icon="tabler:settings"
                      className="flex-shrink-0"
                      width="20"
                      height="20"
                    />
                  )}
                  className="py-2.5"
                  onClick={handleNavigation}
                >
                  <span className="ml-3">Paramètres</span>
                </Sidebar.Item>
                <Sidebar.Item
                  as={NavLink}
                  to="/support"
                  icon={() => (
                    <Icon
                      icon="tabler:lifebuoy"
                      className="flex-shrink-0"
                      width="20"
                      height="20"
                    />
                  )}
                  className="py-2.5"
                  onClick={handleNavigation}
                >
                  <span className="ml-3">Assistance</span>
                </Sidebar.Item>
              </Sidebar.ItemGroup>

              {/* User Profile & Logout */}
              <Sidebar.ItemGroup className="p-4 border-t border-gray-200">
                {renderUserProfile()}
              </Sidebar.ItemGroup>
            </div>
          </div>
        </Sidebar>
      </div>
    </>
  );
}
