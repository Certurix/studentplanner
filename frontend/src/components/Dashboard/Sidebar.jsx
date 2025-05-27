import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { Icon } from "@iconify-icon/react";
import { NavLink, useNavigate } from "react-router-dom";
import { Sidebar, Button } from "flowbite-react";
import useUser from "../../hooks/useUser";

export default function SidebarComponent({ data }) {
	// State for search, avatar, and mobile sidebar
	const [searchQuery, setSearchQuery] = useState("");
	const [avatar, setAvatar] = useState(null);
	const [isMobileOpen, setIsMobileOpen] = useState(false);

	const navigate = useNavigate();
	const { clearUserId } = useUser();
	const avatarUrlRef = useRef(null);
	const sidebarRef = useRef(null);

	// Toggle sidebar on mobile
	const toggleMobileSidebar = () => setIsMobileOpen((prev) => !prev);

	// Close sidebar on navigation (mobile)
	const handleNavigation = () => {
		if (window.innerWidth < 768) setIsMobileOpen(false);
	};

	// Close sidebar when clicking outside (mobile)
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

	// Fetch avatar from ui-avatars.com
	const getAvatar = useCallback(() => {
		if (!data?.name || !data?.lastname) return;
		if (avatarUrlRef.current) {
			URL.revokeObjectURL(avatarUrlRef.current);
			avatarUrlRef.current = null;
		}
		axios
			.get(
				`https://ui-avatars.com/api/?name=${encodeURIComponent(
					data.name
				)}+${encodeURIComponent(data.lastname)}&background=random`,
				{ responseType: "blob" }
			)
			.then((response) => {
				const url = URL.createObjectURL(response.data);
				avatarUrlRef.current = url;
				setAvatar(url);
			})
			.catch(() => setAvatar(null));
	}, [data?.name, data?.lastname]);

	// Fetch avatar on data change, cleanup on unmount
	useEffect(() => {
		if (data && data.name && data.lastname) getAvatar();
		return () => {
			if (avatarUrlRef.current) {
				URL.revokeObjectURL(avatarUrlRef.current);
				avatarUrlRef.current = null;
			}
		};
	}, [data, getAvatar]);

	// Handle search submit
	const handleSearchSubmit = (e) => {
		e.preventDefault();
		navigate(`/events/search?query=${encodeURIComponent(searchQuery)}`);
		if (window.innerWidth < 768) setIsMobileOpen(false);
	};

	// Handle logout
	const handleLogout = () => {
		clearUserId();
		navigate("/login");
	};

	// Render search form (semantic, accessible)
	const renderSearchForm = () => (
		<form onSubmit={handleSearchSubmit} className="px-0" role="search">
			<div className="relative">
				<label htmlFor="sidebar-search" className="sr-only">
					Rechercher des événements
				</label>
				<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none" aria-hidden="true">
					<Icon icon="tabler:search" width="16" height="16" className="text-gray-500" />
				</div>
				<input
					id="sidebar-search"
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
					className="w-10 h-10 rounded-full border border-gray-300 bg-gray-200"
				/>
			) : (
				<div
					className="w-10 h-10 rounded-full border border-gray-300 bg-gray-200"
					aria-label="Avatar par défaut"
				/>
			)}
			<div className="min-w-0 flex-1 overflow-hidden">
				<p className="font-semibold truncate" title={`${data.name} ${data.lastname}`}>
					{data.name} {data.lastname}
				</p>
				<p className="text-sm text-gray-500 truncate" title={data.email}>
					{data.email}
				</p>
			</div>
			<Button
				onClick={handleLogout}
				color="alternative"
        pill
				size="xs"
				className="hover:bg-red-100 text-gray-500 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
				aria-label="Déconnexion"
				type="button"
				tabIndex={0}
			>
				<Icon icon="tabler:logout" width="20" height="20" />
			</Button>
		</div>
	);

	// Utility: get active class for NavLink
	const getNavLinkClass = ({ isActive }) =>
		`flex items-center py-2.5 w-full transition-colors duration-150 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
		${isActive ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-gray-100 text-gray-700"}`;

	// Utility: get active class for sub NavLink
	const getSubNavLinkClass = ({ isActive }) =>
		`pl-11 py-2 w-full flex items-center transition-colors duration-150 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
		${isActive ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-gray-100 text-gray-700"}`;

	return (
		<>
			{/* Mobile toggle button */}
			<Button
				onClick={toggleMobileSidebar}
				color="blue"
				size="sm"
				className={`md:hidden fixed top-4 z-50 rounded-xl mx-2 shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500
					${isMobileOpen ? "left-[16rem]" : "left-4"}
					transition-all duration-300`}
				aria-label="Ouvrir menu de navigation"
				aria-expanded={isMobileOpen}
				type="button"
				tabIndex={0}
			>
				<Icon icon={isMobileOpen ? "tabler:x" : "tabler:menu-2"} width="24" height="24" />
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
				className={`fixed md:static inset-y-0 left-0 z-40 transition-transform duration-300 ease-in-out ${
					isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
				} w-64 md:w-1/6 flex-shrink-0`}
				aria-label="Navigation principale"
			>
				<Sidebar className="h-full min-h-screen shadow-lg flex flex-col bg-white">
					<div className="flex flex-col h-full justify-between">
						{/* Top section: logo, search, nav */}
						<section>
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
							{renderSearchForm()}
							<Sidebar.Items>
								<Sidebar.ItemGroup>
									<Sidebar.Item
										as={NavLink}
										to="/"
										icon={() => <Icon icon="tabler:home" width="20" height="20" />}
										className={({ isActive }) => getNavLinkClass({ isActive })}
										onClick={handleNavigation}
									>
										<span className="ml-3">Accueil</span>
									</Sidebar.Item>
									<Sidebar.Collapse
										label={<span className="ml-3">Plannings</span>}
										icon={() => <Icon icon="tabler:calendar-week" width="20" height="20" />}
										className="py-2.5"
									>
										<Sidebar.Item
											as={NavLink}
											to="/plannings/scolaire"
											icon={() => <Icon icon="tabler:school" width="20" height="20" />}
											className={({ isActive }) => getSubNavLinkClass({ isActive })}
											onClick={handleNavigation}
										>
											<span className="ml-3">Scolaire</span>
										</Sidebar.Item>
										<Sidebar.Item
											as={NavLink}
											to="/plannings/personnel"
											icon={() => <Icon icon="tabler:user" width="20" height="20" />}
											className={({ isActive }) => getSubNavLinkClass({ isActive })}
											onClick={handleNavigation}
										>
											<span className="ml-3">Personnel</span>
										</Sidebar.Item>
										<Sidebar.Item
											as={NavLink}
											to="/plannings/professionnel"
											icon={() => <Icon icon="tabler:briefcase" width="20" height="20" />}
											className={({ isActive }) => getSubNavLinkClass({ isActive })}
											onClick={handleNavigation}
										>
											<span className="ml-3">Professionnel</span>
										</Sidebar.Item>
									</Sidebar.Collapse>
									<Sidebar.Collapse
										label={<span className="ml-3">Ma classe</span>}
										icon={() => <Icon icon="tabler:school" width="20" height="20" />}
										className="py-2.5"
									>
										<Sidebar.Item
											as={NavLink}
											to="/class/chat"
											icon={() => <Icon icon="tabler:messages" width="20" height="20" />}
											className={({ isActive }) => getSubNavLinkClass({ isActive })}
											onClick={handleNavigation}
										>
											<span className="ml-3">Chat</span>
										</Sidebar.Item>
										<Sidebar.Item
											as={NavLink}
											to="/class/members"
											icon={() => <Icon icon="tabler:users" width="20" height="20" />}
											className={({ isActive }) => getSubNavLinkClass({ isActive })}
											onClick={handleNavigation}
										>
											<span className="ml-3">Membres</span>
										</Sidebar.Item>
										<Sidebar.Item
											icon={() => <Icon icon="tabler:ban" width="20" height="20" />}
											disabled
											className="pl-11 py-2 w-full flex items-center text-gray-400"
										>
											<span className="ml-3">Personnel</span>
										</Sidebar.Item>
									</Sidebar.Collapse>
								</Sidebar.ItemGroup>
							</Sidebar.Items>
						</section>
						{/* Bottom section: settings, support, user */}
						<footer className="mt-auto">
							<Sidebar.ItemGroup className="space-y-1 border-t border-gray-200 pt-3">
								<Sidebar.Item
									as={NavLink}
									to="/settings"
									icon={() => <Icon icon="tabler:settings" width="20" height="20" />}
									className={({ isActive }) => getNavLinkClass({ isActive })}
									onClick={handleNavigation}
								>
									<span className="ml-3">Paramètres</span>
								</Sidebar.Item>
								<Sidebar.Item
									as={NavLink}
									to="/support"
									icon={() => <Icon icon="tabler:lifebuoy" width="20" height="20" />}
									className={({ isActive }) => getNavLinkClass({ isActive })}
									onClick={handleNavigation}
								>
									<span className="ml-3">Assistance</span>
								</Sidebar.Item>
							</Sidebar.ItemGroup>
							<Sidebar.ItemGroup className="p-4 border-t border-gray-200">
								{renderUserProfile()}
							</Sidebar.ItemGroup>
						</footer>
					</div>
				</Sidebar>
			</aside>
		</>
	);
}
