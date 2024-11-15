// src/components/Calendar.js

export default function Calendar() {
  const daysOfWeek = ["LUN", "MAR", "MER", "JEU", "VEN", "SAM", "DIM"];
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg mb-6 w-full max-w-md mx-auto">
      <h2 className="text-center text-xl font-semibold mb-4">Avril</h2>
      
      {/* Weekday headers */}
      <div className="grid grid-cols-7 text-center text-sm text-gray-500 mb-2">
        {daysOfWeek.map((day, index) => (
          <div key={index} className="font-medium">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-2 text-center">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className={`p-2 rounded-full text-sm ${
              i % 5 === 0 ? 'bg-indigo-200 text-indigo-700' : 'text-gray-700'
            }`}
            style={{ width: "30px", height: "30px", lineHeight: "15px" }}
          >
            {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}