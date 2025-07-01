import React from "react";
import Planning from "@/components/Planning";
import useAllPlanningEvents from "@/hooks/useAllPlanningEvents";

/**
 * Composant pour afficher tous les plannings (personnel, académique, professionnel)
 */
const PlanningAll = () => {
  // Récupération des événements de tous les plannings
  const { events, isLoading } = useAllPlanningEvents("PlanningAll");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
          <p className="text-gray-500">Chargement de tous vos plannings...</p>
        </div>
      </div>
    );
  }

  return <Planning title="Tous les plannings" initialEvents={events} />;
};

export default PlanningAll;
