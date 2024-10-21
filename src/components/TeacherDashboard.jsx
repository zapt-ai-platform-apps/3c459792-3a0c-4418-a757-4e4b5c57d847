import { createSignal, onMount, Show, For } from 'solid-js';
import { supabase } from '../supabaseClient';

function TeacherDashboard(props) {
  const [students, setStudents] = createSignal([]);
  const [loading, setLoading] = createSignal(false);

  const fetchStudents = async () => {
    setLoading(true);
    let { data, error } = await supabase
      .from('subjects')
      .select('student_id')
      .eq('teacher_email', props.user().email);

    if (data) {
      const studentIds = Array.from(new Set(data.map((item) => item.student_id)));
      const { data: studentProfiles, error: profilesError } = await supabase
        .from('profiles')
        .select('email')
        .in('id', studentIds);

      if (studentProfiles) {
        setStudents(studentProfiles);
      }
    }
    setLoading(false);
  };

  onMount(fetchStudents);

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
      <h2 class="text-xl font-bold mb-4 text-purple-600">Your Students</h2>
      <Show when={!loading()} fallback={<p>Loading...</p>}>
        <ul>
          <For each={students()}>
            {(student) => (
              <li class="bg-white p-4 rounded-lg shadow-md mb-2">{student.email}</li>
            )}
          </For>
        </ul>
      </Show>
    </div>
  );
}

export default TeacherDashboard;