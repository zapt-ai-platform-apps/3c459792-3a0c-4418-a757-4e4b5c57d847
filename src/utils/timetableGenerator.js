import { addDays, differenceInDays, addMinutes, isBefore, parseISO } from 'date-fns';

export function generateTimetable(subjects, availabilityData) {
  const timetable = [];
  const sessionDuration = availabilityData.sessionDuration;
  const startDate = availabilityData.startDate ? new Date(availabilityData.startDate) : new Date();
  const availability = availabilityData.availability;

  subjects.forEach((subject) => {
    const examDate = parseISO(subject.exam_date);
    let currentDate = startDate;
    let daysUntilExam = differenceInDays(examDate, currentDate) - 7; // Stop scheduling one week before exam
    let totalSessions = Math.floor((daysUntilExam * subject.confidence_level) / 3);

    while (totalSessions > 0 && isBefore(currentDate, examDate)) {
      const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      const sessions = availability[dayName];

      sessions.forEach((session) => {
        const startTime = new Date(currentDate);
        if (session === 'morning') {
          startTime.setHours(9, 0, 0, 0);
        } else if (session === 'afternoon') {
          startTime.setHours(13, 0, 0, 0);
        } else if (session === 'evening') {
          startTime.setHours(17, 0, 0, 0);
        }
        const endTime = addMinutes(startTime, sessionDuration);

        timetable.push({
          student_id: subject.student_id,
          subject: subject.subject,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          completed: false,
          content: '', // Add logic to fetch syllabus content if needed
        });
        totalSessions--;
      });

      currentDate = addDays(currentDate, 1);
    }
  });

  return timetable;
}