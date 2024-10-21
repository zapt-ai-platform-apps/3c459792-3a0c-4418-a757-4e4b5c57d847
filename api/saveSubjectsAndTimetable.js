import { authenticateUser } from './_apiUtils.js';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { profiles, subjects, timetable } from '../drizzle/schema.js';
import { generateTimetable } from '../src/utils/timetableGenerator.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const user = await authenticateUser(req);
    const { subjectData, availabilityData } = req.body;

    if (!subjectData || !availabilityData) {
      return res.status(400).json({ error: 'Subject data and availability data are required' });
    }

    const connection = neon(process.env.NEON_DB_URL);
    const db = drizzle(connection);

    const subjectsWithStudentId = subjectData.map((subject) => ({ ...subject, student_id: user.id }));

    await db.transaction(async (tx) => {
      // Save subjects
      await tx.insert(subjects).values(subjectsWithStudentId);

      // Update profile
      await tx.update(profiles)
        .set({
          setup_complete: true,
          availability: availabilityData,
        })
        .where(eq(profiles.id, user.id));

      // Generate timetable
      const generatedTimetable = generateTimetable(subjectsWithStudentId, availabilityData);

      // Save timetable
      await tx.insert(timetable).values(generatedTimetable);
    });

    res.status(200).json({ message: 'Setup completed successfully' });
  } catch (error) {
    console.error('Error completing setup:', error);
    if (error.message.includes('Authorization') || error.message.includes('token')) {
      res.status(401).json({ error: 'Authentication failed' });
    } else {
      res.status(500).json({ error: 'Error completing setup' });
    }
  }
}