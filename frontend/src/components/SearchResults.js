import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const SearchResults = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search).get("query");
    if (query) {
      fetchEvents(query);
    }
  }, [location.search]);

  const fetchEvents = async (query) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/events/search`, {
        params: { query },
      });
      setEvents(response.data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Résultats de recherche</h2>
      {events.length > 0 ? (
        events.map((event) => (
          <div key={event.id} className="mb-4 p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-medium">{event.title}</h3>
            <p className="text-sm text-gray-500">{event.date}</p>
            <p className="text-sm">{event.description}</p>
          </div>
        ))
      ) : (
        <p>Aucun événement trouvé pour "{new URLSearchParams(location.search).get("query")}"</p>
      )}
    </div>
  );
};

export default SearchResults;