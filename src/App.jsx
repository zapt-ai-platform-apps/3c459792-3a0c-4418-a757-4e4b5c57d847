import { createSignal, onMount, createEffect, Show } from 'solid-js';
import { supabase } from './supabaseClient';
import { Auth } from '@supabase/auth-ui-solid';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';

function App() {
  const [user, setUser] = createSignal(null);
  const [role, setRole] = createSignal(null);
  const [currentPage, setCurrentPage] = createSignal('login');

  const checkUserSignedIn = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      fetchUserRole(user);
    }
  };

  const fetchUserRole = async (user) => {
    let { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (data) {
      setRole(data.role);
      setCurrentPage(data.role === 'student' ? 'studentDashboard' : 'teacherDashboard');
    } else {
      setCurrentPage('selectRole');
    }
  };

  onMount(checkUserSignedIn);

  createEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchUserRole(session.user);
      } else {
        setUser(null);
        setCurrentPage('login');
      }
    });

    return () => {
      authListener?.unsubscribe();
    };
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
    setCurrentPage('login');
  };

  const [selectRoleLoading, setSelectRoleLoading] = createSignal(false);

  const selectRole = async (selectedRole) => {
    if (selectRoleLoading()) return;
    setSelectRoleLoading(true);

    const { error } = await supabase.from('profiles').upsert({
      id: user().id,
      email: user().email,
      role: selectedRole
    });

    setSelectRoleLoading(false);

    if (!error) {
      setRole(selectedRole);
      setCurrentPage(selectedRole === 'student' ? 'studentDashboard' : 'teacherDashboard');
    } else {
      console.error('Error setting role:', error);
    }
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4 text-gray-800">
      <Show
        when={currentPage() === 'login'}
        fallback={
          <Show
            when={currentPage() === 'selectRole'}
            fallback={
              <Show
                when={currentPage() === 'studentDashboard'}
                fallback={
                  <Show when={currentPage() === 'teacherDashboard'}>
                    <TeacherDashboard user={user} onSignOut={handleSignOut} />
                  </Show>
                }
              >
                <StudentDashboard user={user} onSignOut={handleSignOut} />
              </Show>
            }
          >
            <div class="flex items-center justify-center min-h-screen">
              <div class="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
                <h2 class="text-2xl font-bold mb-6 text-center text-purple-600">Select Your Role</h2>
                <div class="space-y-4">
                  <button
                    class={`w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${
                      selectRoleLoading() ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    onClick={() => selectRole('student')}
                    disabled={selectRoleLoading()}
                  >
                    I am a Student
                  </button>
                  <button
                    class={`w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${
                      selectRoleLoading() ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    onClick={() => selectRole('teacher')}
                    disabled={selectRoleLoading()}
                  >
                    I am a Teacher
                  </button>
                </div>
              </div>
            </div>
          </Show>
        }
      >
        <div class="flex items-center justify-center min-h-screen">
          <div class="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
            <h2 class="text-3xl font-bold mb-6 text-center text-purple-600">Sign in with ZAPT</h2>
            <a
              href="https://www.zapt.ai"
              target="_blank"
              rel="noopener noreferrer"
              class="text-blue-500 hover:underline mb-6 block text-center"
            >
              Learn more about ZAPT
            </a>
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              providers={['google', 'facebook', 'apple']}
              magicLink={true}
              showLinks={false}
              view="magic_link"
              redirectTo={window.location.origin}
            />
          </div>
        </div>
      </Show>
    </div>
  );
}

export default App;