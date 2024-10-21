import { pgTable, serial, text, timestamp, uuid, integer, jsonb, boolean } from 'drizzle-orm/pg-core';

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull(),
  role: text('role').notNull(),
  setup_complete: boolean('setup_complete').default(false),
  availability: jsonb('availability'),
});

export const subjects = pgTable('subjects', {
  id: serial('id').primaryKey(),
  student_id: uuid('student_id').notNull(),
  subject: text('subject').notNull(),
  exam_date: timestamp('exam_date').notNull(),
  exam_board: text('exam_board').notNull(),
  teacher_email: text('teacher_email').notNull(),
  confidence_level: integer('confidence_level').notNull(),
});

export const timetable = pgTable('timetable', {
  id: serial('id').primaryKey(),
  student_id: uuid('student_id').notNull(),
  subject: text('subject').notNull(),
  start_time: timestamp('start_time').notNull(),
  end_time: timestamp('end_time').notNull(),
  completed: boolean('completed').default(false),
  content: text('content'),
});