import { onMount, createSignal } from 'solid-js';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Calendar as FullCalendar } from '@fullcalendar/core';
import '@fullcalendar/common/main.css';
import '@fullcalendar/daygrid/main.css';

function Calendar(props) {
  let calendarEl;
  const [calendar, setCalendar] = createSignal(null);

  onMount(() => {
    const cal = new FullCalendar(calendarEl, {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      events: props.events,
      editable: true,
      selectable: true,
      eventDrop: props.onEventChange,
      eventClick: props.onEventClick,
    });
    cal.render();
    setCalendar(cal);
  });

  return <div ref={(el) => (calendarEl = el)} class="h-full"></div>;
}

export default Calendar;