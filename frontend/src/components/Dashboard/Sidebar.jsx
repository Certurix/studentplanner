import React, { useState, useEffect } from "react";
import { Icon } from "@iconify-icon/react";
import { NavLink, useNavigate } from "react-router-dom";
import { Sidebar } from "flowbite-react";
import useUser from "../../hooks/useUser";

export default function SidebarComponent({ data }) {
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
    // TODO: Sauvegarder l'avatar dans la base de données et le récupérer ici
    fetch(
      `https://cors-anywhere.herokuapp.com/https://img.buymeacoffee.com/api/?name=${data.name}+${data.lastname}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
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
    <Sidebar className="flex flex-col h-auto w-full md:w-1/6 min-h-screen shadow-lg z-50">
      <div className="flex flex-col h-full justify-between">
        {/* Top section with logo, search, and main navigation */}
        <div className="flex flex-col">
          {/* Logo */}
          <Sidebar.Logo href="/" img="/logo.svg" imgAlt="StudentPlanner Logo">
            StudentPlanner
          </Sidebar.Logo>

          {/* Search */}
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
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
                className="block w-full pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                required
              />
            </div>
          </form>

          {/* Main Sidebar Items */}
          <Sidebar.Items>
            <Sidebar.ItemGroup>
              <Sidebar.Item
                as={NavLink}
                to="/"
                icon={() => <Icon icon="tabler:home" width="20" />}
              >
                Accueil
              </Sidebar.Item>

              {/* Plannings Dropdown */}
              <Sidebar.Collapse
                label="Plannings"
                icon={() => <Icon icon="tabler:calendar-week" width="20" />}
              >
                <Sidebar.Item
                  as={NavLink}
                  to="/plannings/scolaire"
                  icon={() => <Icon icon="tabler:school" width="20" />}
                >
                  Scolaire
                </Sidebar.Item>
                <Sidebar.Item
                  as={NavLink}
                  to="/plannings/personnel"
                  icon={() => <Icon icon="tabler:user" width="20" />}
                >
                  Personnel
                </Sidebar.Item>
                <Sidebar.Item
                  as={NavLink}
                  to="/plannings/professionnel"
                  icon={() => <Icon icon="tabler:briefcase" width="20" />}
                >
                  Professionnel
                </Sidebar.Item>
              </Sidebar.Collapse>

              {/* Ma Classe Dropdown */}
              <Sidebar.Collapse
                label="Ma classe"
                icon={() => <Icon icon="tabler:school" width="20" />}
                className="z-50"
              >
                <Sidebar.Item
                  as={NavLink}
                  to="/class/chat"
                  icon={() => <Icon icon="tabler:messages" width="20" />}
                >
                  Chat
                </Sidebar.Item>
                <Sidebar.Item
                  as={NavLink}
                  to="/class/members"
                  icon={() => <Icon icon="tabler:users" width="20" />}
                >
                  Membres
                </Sidebar.Item>
                <Sidebar.Item
                  icon={() => <Icon icon="tabler:ban" width="20" />}
                  disabled
                >
                  Personnel
                </Sidebar.Item>
              </Sidebar.Collapse>
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </div>

        {/* Bottom section with Settings, Support, and User Info */}
        <div className="mt-auto">
          {/* Settings & Support */}
          <Sidebar.ItemGroup>
            <Sidebar.Item
              as={NavLink}
              to="/settings"
              icon={() => <Icon icon="tabler:settings" width="20" />}
            >
              Paramètres
            </Sidebar.Item>
            <Sidebar.Item
              as={NavLink}
              to="/support"
              icon={() => <Icon icon="tabler:lifebuoy" width="20" />}
            >
              Assistance
            </Sidebar.Item>
          </Sidebar.ItemGroup>

          {/* User Info & Logout */}
          <Sidebar.ItemGroup className="p-4 border-t border-gray-200">
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
                <Icon icon="tabler:logout" width="20" />
              </button>
            </div>
          </Sidebar.ItemGroup>
        </div>
      </div>
    </Sidebar>
  );
}
