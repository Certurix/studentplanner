import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify-icon/react";
import { NavLink, useNavigate } from "react-router-dom";
import { Sidebar, Button } from "flowbite-react";
import useUser from "@/hooks/useUser";
import Avatar from "@/components/ui/Avatar";

// Composant de lien de navigation pour un style et un comportement cohérents
const NavItem = ({ to, icon, children, onClick, className }) => (
  <Sidebar.Item
    as={NavLink}
    to={to}
    icon={() => <Icon icon={`tabler:${icon}`} width="20" height="20" />}
    className={className}
    onClick={onClick}
  >
    <span className="ml-3">{children}</span>
  </Sidebar.Item>
);

// Composant de lien de navigation spécifiquement pour les sous-éléments
const SubNavItem = ({ to, icon, children, onClick, className, disabled }) => {
  const baseProps = {
    icon: () => <Icon icon={`tabler:${icon}`} width="20" height="20" />,
  };

  if (disabled) {
    return (
      <Sidebar.Item
        {...baseProps}
        disabled
        className="pl-11 py-2 w-full flex items-center text-gray-400"
      >
        <span className="ml-3">{children}</span>
      </Sidebar.Item>
    );
  }

  return (
    <Sidebar.Item
      as={NavLink}
      to={to}
      {...baseProps}
      className={className}
      onClick={onClick}
    >
      <span className="ml-3">{children}</span>
    </Sidebar.Item>
  );
};

export default function SidebarComponent({ data }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { clearUserId } = useUser();
  const sidebarRef = useRef(null);

  // Gestion des actions sur la vue mobile
  const toggleMobileSidebar = () => {
    const newState = !isMobileOpen;
    setIsMobileOpen(newState);
  };

  const handleNavigation = () => {
    if (window.innerWidth < 768) {
      setIsMobileOpen(false);
    }
  };

  // Ferme la sidebar quand on clique en dehors de la sidebar (mobile)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        isMobileOpen
      ) {
        setIsMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileOpen]);

  // Gestion de la soumission du formulaire de recherche
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/events/search?query=${encodeURIComponent(searchQuery)}`);
    if (window.innerWidth < 768) setIsMobileOpen(false);
  };

  const handleLogout = () => {
    clearUserId();
    navigate("/login");
  };

  // Classes pour les liens de navigation (actif/inactif)
  const getNavLinkClass = ({ isActive }) => `
		flex items-center py-2.5 w-full transition-colors duration-150 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600
		${
      isActive
        ? "bg-indigo-600 text-blue-700 font-semibold"
        : "hover:bg-gray-100 text-gray-700"
    }
	`;

  const getSubNavLinkClass = ({ isActive }) => `
		pl-11 py-2 w-full flex items-center transition-colors duration-150 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600
		${
      isActive
        ? "bg-indigo-600 text-blue-700 font-semibold"
        : "hover:bg-gray-100 text-gray-700"
    }
	`;

  // Définition des éléments de navigation
  const mainNavItems = [{ to: "/dashboard", icon: "home", label: "Accueil" }];

  const planningItems = [
    { to: "/dashboard/plannings/all", icon: "calendar", label: "Tous" },
    { to: "/dashboard/plannings/scolaire", icon: "school", label: "Scolaire" },
    { to: "/dashboard/plannings/personnel", icon: "user", label: "Personnel" },
    {
      to: "/dashboard/plannings/professionnel",
      icon: "briefcase",
      label: "Professionnel",
    },
  ];

  const classItems = [
    { to: "/dashboard/class/chat", icon: "messages", label: "Chat" },
    { to: "/dashboard/class/members", icon: "users", label: "Membres" },
  ];

  const footerItems = [
    { to: "/dashboard/support", icon: "lifebuoy", label: "Assistance" },
    { to: "/dashboard/settings", icon: "settings", label: "Paramètres" },
  ];

  return (
    <>
      {/* Bouton de navigation pour mobile (toggle) */}
      <Button
        onClick={toggleMobileSidebar}
        color="blue"
        size="sm"
        className={`md:hidden fixed top-4 z-50 rounded-full mx-2 shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500
						${isMobileOpen ? "left-[16rem]" : "left-4"}
						transition-all duration-300`}
        aria-label="Ouvrir menu de navigation"
        aria-expanded={isMobileOpen}
        type="button"
      >
        <Icon
          icon={isMobileOpen ? "tabler:x" : "tabler:menu-2"}
          width="20"
          height="20"
        />
      </Button>

      {/* Backdrop overlay on mobile */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-40 transition-transform duration-300 ease-in-out 
					${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
					w-64 flex-shrink-0`}
        aria-label="Navigation principale"
      >
        <Sidebar className="h-screen overflow-y-auto py-0 bg-white shadow-lg border-r border-gray-200">
          <div className="flex flex-col h-full justify-between">
            {/* Top section: logo, recherche, nav */}
            <section>
              <Sidebar.Logo
                href="/"
                img="/logo.svg"
                imgAlt="StudentPlanner Logo"
                className="flex items-center py-4 px-4"
              >
                <span className="self-center text-xl font-bold whitespace-nowrap">
                  StudentPlanner
                </span>
              </Sidebar.Logo>

              {/* Formulaire de recherche */}
              <form
                onSubmit={handleSearchSubmit}
                className="px-4 mb-3"
                role="search"
              >
                <div className="relative">
                  <label htmlFor="sidebar-search" className="sr-only">
                    Rechercher des événements
                  </label>
                  <div
                    className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
                    aria-hidden="true"
                  >
                    <Icon
                      icon="tabler:search"
                      width="16"
                      height="16"
                      className="text-gray-500"
                    />
                  </div>
                  <input
                    id="sidebar-search"
                    type="search"
                    className="block w-full pl-10 py-2 text-sm text-gray-500 border border-gray-300 rounded-lg bg-gray-50 focus:ring-indigo-600 focus:border-indigo-600"
                    placeholder="Rechercher"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    required
                    aria-label="Rechercher des événements"
                  />
                </div>
              </form>

              {/* Elements de navigation */}
              <Sidebar.Items className="mt-0">
                <Sidebar.ItemGroup>
                  {/* Elements de navigation principaux */}
                  {mainNavItems.map((item) => (
                    <NavItem
                      key={item.to}
                      to={item.to}
                      icon={item.icon}
                      className={getNavLinkClass}
                      onClick={handleNavigation}
                    >
                      {item.label}
                    </NavItem>
                  ))}

                  {/* Menu déroulant "Plannings" */}
                  <Sidebar.Collapse
                    label={<span className="ml-3">Plannings</span>}
                    icon={() => (
                      <Icon
                        icon="tabler:calendar-week"
                        width="20"
                        height="20"
                      />
                    )}
                    className="py-2.5"
                  >
                    {planningItems.map((item) => (
                      <SubNavItem
                        key={item.to}
                        to={item.to}
                        icon={item.icon}
                        className={getSubNavLinkClass}
                        onClick={handleNavigation}
                      >
                        {item.label}
                      </SubNavItem>
                    ))}
                  </Sidebar.Collapse>

                  {/* Menu déroulant "Ma classe" */}
                  <Sidebar.Collapse
                    label={<span className="ml-3">Ma classe</span>}
                    icon={() => (
                      <Icon icon="tabler:school" width="20" height="20" />
                    )}
                    className="py-2.5"
                  >
                    {classItems.map((item, index) => (
                      <SubNavItem
                        key={item.to || `class-item-${index}`}
                        to={item.to}
                        icon={item.icon}
                        className={getSubNavLinkClass}
                        onClick={handleNavigation}
                        disabled={item.disabled}
                      >
                        {item.label}
                      </SubNavItem>
                    ))}
                  </Sidebar.Collapse>
                </Sidebar.ItemGroup>
              </Sidebar.Items>
            </section>

            {/* Bas de la sidebar : paramètres, support, profil utilisateur */}
            <footer className="mt-auto">
              <Sidebar.ItemGroup className="space-y-1 border-t border-gray-200 pt-3">
                {footerItems.map((item) => (
                  <NavItem
                    key={item.to}
                    to={item.to}
                    icon={item.icon}
                    className={getNavLinkClass}
                    onClick={handleNavigation}
                  >
                    {item.label}
                  </NavItem>
                ))}
              </Sidebar.ItemGroup>

              {/* Profil utilisateur */}
              <Sidebar.ItemGroup className="p-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <Avatar
                    name={data.name}
                    lastname={data.lastname}
                    alt={`Avatar de ${data.name} ${data.lastname}`}
                    className="w-10 h-10"
                  />
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
                  <Button
                    onClick={handleLogout}
                    color="alternative"
                    pill
                    size="xs"
                    className="hover:bg-red-100 text-gray-500 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    aria-label="Déconnexion"
                    type="button"
                  >
                    <Icon icon="tabler:logout" width="20" height="20" />
                  </Button>
                </div>
              </Sidebar.ItemGroup>
            </footer>
          </div>
        </Sidebar>
      </aside>
    </>
  );
}
