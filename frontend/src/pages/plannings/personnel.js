import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const PlanningPerso = () => {
  const [events, setEvents] = useState([
    {
      title: 'RDV',
      start: new Date(),
      end: new Date(moment().add(1, 'hours').toDate()),
    },
    {
      title: 'Atelier cuisine',
      start: new Date(moment().add(2, 'hours').toDate()),
      end: new Date(moment().add(3, 'hours').toDate()),
    },
  ]);

  const handleSelectSlot = ({ start, end }) => {
    const title = window.prompt('New Event Name');
    if (title) {
      setEvents([...events, { start, end, title }]);
    }
  };

  const handleSelectEvent = (event) => {
    
  };

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        defaultView="week"
        views={['month', 'week', 'day', 'agenda']}
        style={{ height: 500 }}
      />
    </div>
  );
};

export default PlanningPerso;