import { createSignal, onMount, createEffect, Show } from 'solid-js';
import { supabase } from './supabaseClient';
import { Auth } from '@supabase/auth-ui-solid';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';

function App() {
  const [user, setUser] = createSignal(null);
  const [accessToken, setAccessToken] = createSignal(null);
  const [role, setRole] = createSignal(null);
  const [currentPage, setCurrentPage] = createSignal('login');

  const checkUserSignedIn = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);
      setAccessToken(session.access_token);
      await fetchUserRole(session.access_token);
    }
  };

  const fetchUserRole = async (token) => {
    const response = await fetch('/api/getUserRole', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      setRole(data.role);
      setCurrentPage(data.role === 'student' ? 'studentDashboard' : 'teacherDashboard');
    } else if (response.status === 404) {
      setCurrentPage('selectRole');
    } else {
      console.error('Error fetching user role');
    }
  };

  onMount(checkUserSignedIn);

  createEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_, session) => {
      if (session?.user) {
        setUser(session.user);
        setAccessToken(session.access_token);
        await fetchUserRole(session.access_token);
      } else {
        setUser(null);
        setAccessToken(null);
        setCurrentPage('login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setAccessToken(null);
    setRole(null);
    setCurrentPage('login');
  };

  const [selectRoleLoading, setSelectRoleLoading] = createSignal(false);

  const selectRole = async (selectedRole) => {
    if (selectRoleLoading()) return;
    setSelectRoleLoading(true);

    try {
      const response = await fetch('/api/setUserRole', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken()}`,
        },
        body: JSON.stringify({ role: selectedRole }),
      });

      if (response.ok) {
        setRole(selectedRole);
        setCurrentPage(selectedRole === 'student' ? 'studentDashboard' : 'teacherDashboard');
      } else {
        console.error('Error setting role');
      }
    } catch (error) {
      console.error('Error setting role:', error);
    } finally {
      setSelectRoleLoading(false);
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
                    <TeacherDashboard user={user} onSignOut={handleSignOut} accessToken={accessToken} />
                  </Show>
                }
              >
                <StudentDashboard user={user} onSignOut={handleSignOut} accessToken={accessToken} />
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
                    {selectRoleLoading() ? 'Loading...' : 'I am a Student'}
                  </button>
                  <button
                    class={`w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${
                      selectRoleLoading() ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    onClick={() => selectRole('teacher')}
                    disabled={selectRoleLoading()}
                  >
                    {selectRoleLoading() ? 'Loading...' : 'I am a Teacher'}
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
            />
          </div>
        </div>
      </Show>
    </div>
  );
}

export default App;