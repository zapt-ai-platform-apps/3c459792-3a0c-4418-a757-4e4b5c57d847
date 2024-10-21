import { onMount, onCleanup, createEffect } from 'solid-js';
import { Calendar as FullCalendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import '@fullcalendar/common/main.css';
import '@fullcalendar/daygrid/main.css';

function Calendar(props) {
  let calendarEl;
  let calendar;

  onMount(() => {
    calendar = new FullCalendar(calendarEl, {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      events: props.events(),
      editable: true,
      selectable: true,
      eventDrop: props.onEventChange,
      eventClick: props.onEventClick,
    });
    calendar.render();
  });

  createEffect(() => {
    if (calendar) {
      calendar.removeAllEventSources();
      calendar.addEventSource(props.events());
    }
  });

  onCleanup(() => {
    if (calendar) {
      calendar.destroy();
    }
  });

  return <div ref={(el) => (calendarEl = el)} class="h-full"></div>;
}

export default Calendar;