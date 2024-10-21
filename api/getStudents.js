import { authenticateUser } from './_apiUtils.js';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq, inArray } from 'drizzle-orm';
import { subjects, profiles } from '../drizzle/schema.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const user = await authenticateUser(req);

    const sql = neon(process.env.NEON_DB_URL);
    const db = drizzle(sql);

    const subjectData = await db.select()
      .from(subjects)
      .fields({ student_id: subjects.student_id })
      .where(eq(subjects.teacher_email, user.email));

    const studentIds = Array.from(new Set(subjectData.map((item) => item.student_id)));

    if (studentIds.length === 0) {
      return res.status(200).json([]);
    }

    const studentProfiles = await db.select()
      .from(profiles)
      .fields({ id: profiles.id, email: profiles.email })
      .where(inArray(profiles.id, studentIds));

    res.status(200).json(studentProfiles);
  } catch (error) {
    console.error('Error fetching students:', error);
    if (error.message.includes('Authorization') || error.message.includes('token')) {
      res.status(401).json({ error: 'Authentication failed' });
    } else {
      res.status(500).json({ error: 'Error fetching students' });
    }
  }
}