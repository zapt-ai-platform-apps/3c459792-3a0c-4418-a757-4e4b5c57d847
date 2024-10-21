import { createSignal, onMount, Show } from 'solid-js';
import Calendar from './Calendar';
import InitialSetup from './InitialSetup';

function StudentDashboard(props) {
  const [profile, setProfile] = createSignal({});
  const [timetable, setTimetable] = createSignal([]);
  const [loading, setLoading] = createSignal(false);
  const [currentStep, setCurrentStep] = createSignal('initialSetup');

  const fetchProfile = async () => {
    const response = await fetch('/api/getProfile', {
      headers: {
        'Authorization': `Bearer ${props.accessToken()}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      setProfile(data);
      if (data.setup_complete) {
        setCurrentStep('dashboard');
        fetchTimetable();
      }
    } else {
      console.error('Error fetching profile');
    }
  };

  const fetchTimetable = async () => {
    const response = await fetch('/api/getTimetable', {
      headers: {
        'Authorization': `Bearer ${props.accessToken()}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      const events = data.map((item) => ({
        title: item.subject,
        start: item.start_time,
        end: item.end_time,
        id: item.id,
      }));
      setTimetable(events);
    } else {
      console.error('Error fetching timetable');
    }
  };

  onMount(fetchProfile);

  const completeSetup = async (subjectData, availabilityData) => {
    setLoading(true);

    try {
      const response = await fetch('/api/saveSubjectsAndTimetable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${props.accessToken()}`,
        },
        body: JSON.stringify({ subjectData, availabilityData }),
      });

      if (response.ok) {
        setCurrentStep('dashboard');
        fetchTimetable();
      } else {
        console.error('Error completing setup');
      }
    } catch (error) {
      console.error('Error completing setup:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="h-full">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold text-purple-600">Welcome, {props.user().email}</h1>
        <button
          class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-full shadow-md focus:outline-none cursor-pointer"
          onClick={props.onSignOut}
        >
          Sign Out
        </button>
      </div>
      <Show when={currentStep() === 'initialSetup'}>
        <InitialSetup onComplete={completeSetup} loading={loading} />
      </Show>
      <Show when={currentStep() === 'dashboard'}>
        <Calendar events={timetable} />
      </Show>
    </div>
  );
}

export default StudentDashboard;