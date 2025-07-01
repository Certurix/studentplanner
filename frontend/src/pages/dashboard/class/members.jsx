import React, { useState } from "react";
import { Icon } from "@iconify-icon/react";

/**
 * Composant pour afficher la liste des membres d'une classe
 */
const Members = () => {
  // Requête pour récupérer les membres de la classe
  const fetchMembers = async () => {
    // Requête au backend pour récupérer tous les utilisateurs enregistrés
    fetch(`${import.meta.env.VITE_API_URL || ""}/api/users`)
      .then((response) => response.json())
      .then((data) => {
        // Filtrer les membres pour ne garder que ceux de la classe actuelle
        console.log("Données récupérées:", data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des membres:", error);
        setMembers([]); // Set empty array on error
      });
  };

  // Initialize members state and fetch data on component mount
  useState([]);

  React.useEffect(() => {
    fetchMembers();
  }, []); // Fetch members when component mounts

  // État pour stocker les membres
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  console.log("Members:", members);
  // Filtrer les membres en fonction du terme de recherche
  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: members.length,
    students: members.filter((m) => m.role === "Étudiant").length,
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "Étudiant":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <section className="space-y-6">
      {/* Recherche */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="relative">
          <Icon
            icon="tabler:search"
            width="20"
            height="20"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Rechercher un membre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Members List */}
      <div className="bg-white rounded-lg shadow-md">
        <header className="border-b border-gray-200 p-4">
          <h2 className="font-semibold text-gray-900">
            Membres de la classe ({filteredMembers.length})
          </h2>
        </header>
        <div className="divide-y divide-gray-200">
          {filteredMembers.map((member) => (
            <article
              key={member.id}
              className="p-4 flex items-center space-x-4"
            >
              {/* Avatar */}
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>

              {/* Member Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium text-gray-900 truncate">
                    {member.name}
                  </h3>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(
                      "Étudiant"
                    )}`}
                  >
                    {"Étudiant"}
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate">{member.email}</p>
              </div>
            </article>
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-8">
            <Icon
              icon="tabler:users-group"
              width="40"
              height="40"
              className="text-gray-400 mx-auto mb-2"
            />
            <p className="text-gray-500">Aucun membre trouvé</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Members;
