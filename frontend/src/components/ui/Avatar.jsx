import React, { useState, useEffect, useRef, useCallback } from "react";

/**
 * Avatar component that fetches and displays a user avatar from ui-avatars.com. (mock only)
 * @param {string} name - User's first name (required)
 * @param {string} lastname - User's last name (required)
 * @param {string} alt - Alternative text for the image (required for accessibility)
 * @param {string} className - Additional classes for styling
 * @returns {JSX.Element}
 */
const Avatar = ({ name, lastname, alt, className = "" }) => {
	const [avatarUrl, setAvatarUrl] = useState(null);
	const [error, setError] = useState(false);
	const avatarUrlRef = useRef(null);

	// Fetch avatar from ui-avatars.com
	const fetchAvatar = useCallback(() => {
		if (!name || !lastname) return;
		// Clean up previous object URL if any
		if (avatarUrlRef.current) {
			URL.revokeObjectURL(avatarUrlRef.current);
			avatarUrlRef.current = null;
		}
		// Use fetch API for modern, readable code
		fetch(
			`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}+${encodeURIComponent(lastname)}&background=random`,
			{ method: "GET" }
		)
			.then(async (response) => {
				if (!response.ok) throw new Error("Avatar fetch failed");
				const blob = await response.blob();
				const url = URL.createObjectURL(blob);
				avatarUrlRef.current = url;
				setAvatarUrl(url);
				setError(false);
			})
			.catch(() => {
				setAvatarUrl(null);
				setError(true);
			});
	}, [name, lastname]);

	// Fetch avatar on prop change, cleanup on unmount
	useEffect(() => {
		if (name && lastname) fetchAvatar();
		return () => {
			if (avatarUrlRef.current) {
				URL.revokeObjectURL(avatarUrlRef.current);
				avatarUrlRef.current = null;
			}
		};
	}, [name, lastname, fetchAvatar]);

	if (!name || !lastname) {
		// missing required props
		return (
			<div
				className={`w-10 h-10 rounded-full border border-gray-300 bg-gray-200 flex items-center justify-center ${className}`}
				aria-label="Avatar par défaut"
			/>
		);
	}

	if (error) {
		// fallback to default avatar on error
		return (
			<div
				className={`w-10 h-10 rounded-full border border-gray-300 bg-gray-200 flex items-center justify-center ${className}`}
				aria-label="Erreur de chargement de l'avatar"
			/>
		);
	}

	return avatarUrl ? (
		<img
			src={avatarUrl}
			alt={alt}
			className={`w-10 h-10 rounded-full border border-gray-300 bg-gray-200 object-cover ${className}`}
			loading="lazy"
		/>
	) : (
		// show placeholder when loading
		<div
			className={`w-10 h-10 rounded-full border border-gray-300 bg-gray-100 animate-pulse flex items-center justify-center ${className}`}
			aria-label="Chargement de l'avatar"
		/>
	);
};

export default Avatar;
