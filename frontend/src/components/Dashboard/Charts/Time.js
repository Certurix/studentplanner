const TimeDistribution = () => {
  const data = [
    { label: "Personnel", value: 40, color: "bg-orange-500" },
    { label: "Professionnel", value: 28, color: "bg-yellow-500" },
    { label: "Scolaire", value: 12, color: "bg-blue-500" },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">RÉPARTITION PLANNINGS</h2>
      {data.map((item, index) => (
        <div key={index} className="mb-4">
          <p className="mb-1">{item.label}</p>
          <div className="w-full bg-gray-200 rounded-lg h-4">
            <div
              className={`${item.color} h-full rounded-lg`}
              style={{ width: `${item.value}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TimeDistribution;
