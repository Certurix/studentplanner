// src/components/StatsSummary.js

export default function StatsSummary() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Événements Du Mois</h2>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-3xl font-bold">23</p>
          <p className="text-sm text-gray-500">Achèvés</p>
        </div>
        <div>
          <p className="text-3xl font-bold">40</p>
          <p className="text-sm text-gray-500">À venir</p>
        </div>
      </div>
    </div>
  );
}
