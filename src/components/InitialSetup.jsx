import { createSignal, For } from 'solid-js';

function InitialSetup(props) {
  const [exams, setExams] = createSignal([{ subject: '', exam_date: '', exam_board: '', teacher_email: '', confidence_level: 2 }]);
  const [availability, setAvailability] = createSignal({
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  });
  const [sessionDuration, setSessionDuration] = createSignal(60);
  const [startDate, setStartDate] = createSignal('');

  const addExam = () => {
    setExams([...exams(), { subject: '', exam_date: '', exam_board: '', teacher_email: '', confidence_level: 2 }]);
  };

  const updateExam = (index, field, value) => {
    const updatedExams = [...exams()];
    updatedExams[index][field] = value;
    setExams(updatedExams);
  };

  const toggleAvailability = (day, session) => {
    const dayAvailability = availability()[day];
    if (dayAvailability.includes(session)) {
      setAvailability({ ...availability(), [day]: dayAvailability.filter((s) => s !== session) });
    } else {
      setAvailability({ ...availability(), [day]: [...dayAvailability, session] });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (props.loading) return;
    props.onComplete(exams(), { availability: availability(), sessionDuration: sessionDuration(), startDate: startDate() });
  };

  return (
    <form onSubmit={handleSubmit} class="space-y-4">
      <h2 class="text-xl font-bold mb-2 text-purple-600">Enter Your Exams</h2>
      <For each={exams()}>
        {(exam, index) => (
          <div class="space-y-2 bg-white p-4 rounded-lg shadow-md">
            <input
              type="text"
              placeholder="Subject"
              value={exam.subject}
              onInput={(e) => updateExam(index(), 'subject', e.target.value)}
              class="w-full p-2 border border-gray-300 rounded-lg box-border"
              required
            />
            <input
              type="date"
              value={exam.exam_date}
              onInput={(e) => updateExam(index(), 'exam_date', e.target.value)}
              class="w-full p-2 border border-gray-300 rounded-lg box-border"
              required
            />
            <input
              type="text"
              placeholder="Exam Board"
              value={exam.exam_board}
              onInput={(e) => updateExam(index(), 'exam_board', e.target.value)}
              class="w-full p-2 border border-gray-300 rounded-lg box-border"
              required
            />
            <input
              type="email"
              placeholder="Teacher Email"
              value={exam.teacher_email}
              onInput={(e) => updateExam(index(), 'teacher_email', e.target.value)}
              class="w-full p-2 border border-gray-300 rounded-lg box-border"
              required
            />
            <label class="block">
              Confidence Level:
              <select
                value={exam.confidence_level}
                onChange={(e) => updateExam(index(), 'confidence_level', Number(e.target.value))}
                class="w-full p-2 border border-gray-300 rounded-lg box-border"
              >
                <option value={1}>1 - Low</option>
                <option value={2}>2 - Medium</option>
                <option value={3}>3 - High</option>
              </select>
            </label>
          </div>
        )}
      </For>
      <button
        type="button"
        onClick={addExam}
        class="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 cursor-pointer"
      >
        Add Another Exam
      </button>
      <h2 class="text-xl font-bold mt-6 mb-2 text-purple-600">Set Your Availability</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <For each={['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']}>
          {(day) => (
            <div class="bg-white p-4 rounded-lg shadow-md">
              <h3 class="font-bold capitalize mb-2">{day}</h3>
              <For each={['morning', 'afternoon', 'evening']}>
                {(session) => (
                  <label class="block">
                    <input
                      type="checkbox"
                      checked={availability()[day].includes(session)}
                      onChange={() => toggleAvailability(day, session)}
                      class="mr-2 cursor-pointer"
                    />
                    {session.charAt(0).toUpperCase() + session.slice(1)}
                  </label>
                )}
              </For>
            </div>
          )}
        </For>
      </div>
      <label class="block mt-4">
        Session Duration (minutes):
        <input
          type="number"
          min="30"
          max="120"
          value={sessionDuration()}
          onInput={(e) => setSessionDuration(Number(e.target.value))}
          class="w-full p-2 border border-gray-300 rounded-lg box-border"
          required
        />
      </label>
      <label class="block mt-4">
        Start Date (optional):
        <input
          type="date"
          value={startDate()}
          onInput={(e) => setStartDate(e.target.value)}
          class="w-full p-2 border border-gray-300 rounded-lg box-border"
        />
      </label>
      <button
        type="submit"
        class={`w-full px-4 py-2 mt-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 cursor-pointer ${
          props.loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={props.loading}
      >
        {props.loading ? 'Setting Up...' : 'Complete Setup'}
      </button>
    </form>
  );
}

export default InitialSetup;