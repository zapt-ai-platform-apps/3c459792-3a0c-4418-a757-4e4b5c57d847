import { createSignal, onMount, Show } from 'solid-js';
import { supabase } from '../supabaseClient';
import { generateTimetable } from '../utils/timetableGenerator';
import Calendar from './Calendar';
import InitialSetup from './InitialSetup';

function StudentDashboard(props) {
  const [profile, setProfile] = createSignal({});
  const [subjects, setSubjects] = createSignal([]);
  const [timetable, setTimetable] = createSignal([]);
  const [loading, setLoading] = createSignal(false);
  const [currentStep, setCurrentStep] = createSignal('initialSetup');

  const fetchProfile = async () => {
    let { data, error } = await supabase.from('profiles').select('*').eq('id', props.user().id).single();
    if (data) {
      setProfile(data);
      if (data.setup_complete) {
        setCurrentStep('dashboard');
        fetchTimetable();
      }
    }
  };

  const fetchTimetable = async () => {
    let { data, error } = await supabase.from('timetable').select('*').eq('student_id', props.user().id);
    if (data) {
      setTimetable(data);
    }
  };

  onMount(fetchProfile);

  const completeSetup = async (subjectData, availabilityData) => {
    setLoading(true);
    // Save subjects
    const subjectsWithStudentId = subjectData.map((subject) => ({ ...subject, student_id: props.user().id }));
    const { data: subjectRes, error: subjectError } = await supabase.from('subjects').insert(subjectsWithStudentId);
    if (subjectError) {
      console.error('Error saving subjects:', subjectError);
      setLoading(false);
      return;
    }

    // Update profile
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ setup_complete: true, availability: availabilityData })
      .eq('id', props.user().id);

    if (profileError) {
      console.error('Error updating profile:', profileError);
      setLoading(false);
      return;
    }

    // Generate timetable
    const generatedTimetable = generateTimetable(subjectsWithStudentId, availabilityData);
    const { error: timetableError } = await supabase.from('timetable').insert(generatedTimetable);

    if (timetableError) {
      console.error('Error saving timetable:', timetableError);
      setLoading(false);
      return;
    }

    setCurrentStep('dashboard');
    fetchTimetable();
    setLoading(false);
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