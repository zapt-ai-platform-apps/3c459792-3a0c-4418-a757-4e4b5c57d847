import { authenticateUser } from './_apiUtils.js';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { profiles } from '../drizzle/schema.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const user = await authenticateUser(req);

    const { role } = req.body;
    if (!role) {
      return res.status(400).json({ error: 'Role is required' });
    }

    const sql = neon(process.env.NEON_DB_URL);
    const db = drizzle(sql);

    await db.insert(profiles)
      .values({
        id: user.id,
        email: user.email,
        role,
        setup_complete: false,
        availability: null,
      })
      .onConflictDoUpdate({
        target: profiles.id,
        set: { role },
      });

    res.status(200).json({ message: 'Role updated successfully' });
  } catch (error) {
    console.error('Error setting role:', error);
    if (error.message.includes('Authorization') || error.message.includes('token')) {
      res.status(401).json({ error: 'Authentication failed' });
    } else {
      res.status(500).json({ error: 'Error setting role' });
    }
  }
}