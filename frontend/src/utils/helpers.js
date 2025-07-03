/**
 * Valide une réponse d'API pour éviter les erreurs de type lors du traitement
 * Nécessaire car certaines APIs peuvent retourner du HTML d'erreur au lieu de JSON
 * @param {Object} response - Objet de réponse Axios
 * @returns {Array} - Tableau d'événements valide ou tableau vide
 */
export const validateResponse = (response) => {
  // Vérifie le Content-Type car les pages d'erreur retournent souvent du HTML
  const contentType = response.headers["content-type"] || "";
  if (!contentType.includes("application/json")) {
    console.error(
      "L'API a retourné un type de contenu non-JSON:",
      contentType,
      "Statut:",
      response.status
    );
    return [];
  }

  // S'assure que les données sont un tableau pour éviter les erreurs de map/filter
  if (!Array.isArray(response.data)) {
    console.error("La réponse de l'API n'est pas un tableau:", typeof response.data);
    return [];
  }

  return response.data;
};

/**
 * @deprecated Utiliser dateToBackendFormat() à la place
 * Fonction maintenue pour compatibilité
 */
export const toLocalISOString = (date) => {
	console.warn("toLocalISOString is deprecated, use dateToBackendFormat instead");
	return dateToBackendFormat(date);
};

/**
 * Convertit une date en string ISO format que le backend attend
 * Le backend traite les dates comme étant en heure locale après avoir retiré le 'Z'
 * Cette fonction assure une cohérence entre localhost et production
 * @param {Date} date - Date à convertir
 * @returns {string} - String au format ISO sans conversion de timezone
 */
export const dateToBackendFormat = (date) => {
	if (!date || !(date instanceof Date)) {
		return new Date().toISOString();
	}

	// Construction d'une string ISO qui représente l'heure locale
	// Le backend va retirer le 'Z' et traiter cette heure comme locale
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	const seconds = String(date.getSeconds()).padStart(2, '0');
	const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
	
	return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
};

/**
 * Convertit une chaîne de date de l'API en objet Date local
 * Nécessaire car l'API peut retourner des dates dans différents formats
 * @param {string} dateString - Chaîne de date ISO de l'API
 * @returns {Date} - Objet Date local
 */
export const fromAPIDate = (dateString) => {
	if (!dateString) {
		return new Date();
	}

	// Le constructeur Date gère automatiquement l'interprétation du fuseau horaire
	return new Date(dateString);
};

/**
 * Formate une date pour l'affichage en conservant le fuseau horaire local
 * Évite les problèmes d'affichage de dates décalées dans l'interface
 * @param {Date|string} date - Date à formater
 * @param {Object} options - Options Intl.DateTimeFormat
 * @returns {string} - Chaîne de date formatée
 */
export const formatLocalDate = (date, options = {}) => {
	const dateObj = date instanceof Date ? date : new Date(date);
	
	const defaultOptions = {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
		...options
	};

	return dateObj.toLocaleString("fr-FR", defaultOptions);
};

/**
 * Récupère le fuseau horaire de l'utilisateur
 * Utilisé pour les conversions de dates côté client
 * @returns {string} - Identifiant de fuseau horaire (ex: "Europe/Paris")
 */
export const getUserTimezone = () => {
	return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

/**
 * Vérifie si deux dates correspondent au même jour local
 * Essentiel pour comparer des événements sans tenir compte de l'heure
 * @param {Date|string} date1 - Première date
 * @param {Date|string} date2 - Seconde date
 * @returns {boolean} - True si les dates sont le même jour
 */
export const isSameLocalDay = (date1, date2) => {
	const d1 = date1 instanceof Date ? date1 : new Date(date1);
	const d2 = date2 instanceof Date ? date2 : new Date(date2);
	
	return (
		d1.getFullYear() === d2.getFullYear() &&
		d1.getMonth() === d2.getMonth() &&
		d1.getDate() === d2.getDate()
	);
};

/**
 * Assure qu'une date est correctement traitée pour le fuseau horaire local
 * Remplace la logique précédente avec une approche plus robuste de gestion des erreurs
 * @param {Date|string} date - Date à traiter
 * @returns {Date} - Objet Date traité
 */
export const adjustDateForLocalTimezone = (date) => {
	if (!date) {
		return new Date();
	}
	
	const dateObj = date instanceof Date ? date : new Date(date);
	
	// Protection contre les dates invalides qui pourraient casser l'interface
	if (isNaN(dateObj.getTime())) {
		console.warn("Date invalide fournie à adjustDateForLocalTimezone:", date);
		return new Date();
	}
	
	return dateObj;
};
