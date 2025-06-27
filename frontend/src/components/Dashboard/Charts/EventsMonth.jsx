import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import axios from "axios";
import useUser from "@/hooks/useUser";
import { getEventTypeLabel } from "@/utils/constants";

// Donut chart to show the percentage of events per type in the current month
// Uses ApexCharts with react-apexcharts
const EventsMonth = () => {
  const [series, setSeries] = useState([]);
  const [labels, setLabels] = useState([]);
  const [totalEvents, setTotalEvents] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useUser();
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  useEffect(() => {
    if (userId !== null) {
      const fetchEvents = async () => {
        try {
          const response = await axios.get(
            `${
              import.meta.env.VITE_API_URL
            }/api/events/${userId}/month/${currentMonth}`
          );
          const events = Array.isArray(response.data) ? response.data : [];
          setTotalEvents(events.length);

          // Count per event type using centralized event type labels
          const eventTypeCounts = {};
          events.forEach((event) => {
            const label = getEventTypeLabel(event.type);
            if (!eventTypeCounts[label]) eventTypeCounts[label] = 0;
            eventTypeCounts[label]++;
          });

          const filteredLabels = Object.keys(eventTypeCounts);
          const filteredSeries = filteredLabels.map(
            (key) => eventTypeCounts[key]
          );
          setLabels(filteredLabels);
          setSeries(filteredSeries);
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      };
      fetchEvents();
    }
  }, [userId, currentMonth, currentYear]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const options = {
    chart: {
      type: "donut",
      background: "transparent",
    },
    labels: labels,
    colors: ["#f97316", "#3b82f6", "#10b981"], // event-personnel, event-scolaire, event-professionnel
    legend: {
      position: "bottom",
    },
    dataLabels: {
      style: {
        fontFamily: "Inter, sans-serif",
        fontWeight: "semibold",
      },
      enabled: true,
      formatter: (val) => `${val.toFixed(0)}%`,
    },
    plotOptions: {
      donut: {
        labels: {
          show: true,
          total: {
            show: true,
            label: "Total",
            formatter: () => totalEvents,
          },
        },
      },
    },
    stroke: {
      show: false,
    },
    responsive: [
      {
        breakpoint: 640,
        options: {
          chart: { width: 250 },
          legend: { position: "bottom" },
        },
      },
    ],
    annotations: {
      points: [],
    },
  };

  return (
    <section
      aria-label="Events Donut Chart"
      className="flex flex-col items-center justify-center w-full"
    >
      <Chart
        options={options}
        series={series}
        type="donut"
        width={320}
        aria-label="Donut chart showing percentage of events per type in the current month"
      />
      <figcaption
        className="mt-2 text-sm text-gray-600"
        id="events-donut-caption"
      >
        {totalEvents} événements au total en{" "}
        {now.toLocaleString("fr", { month: "long", year: "numeric" })}
      </figcaption>
    </section>
  );
};

export default EventsMonth;
