import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  defaultGrade: text("default_grade"),
  defaultSubject: text("default_subject"),
  uiLanguage: text("ui_language").default("en"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const worksheets = sqliteTable("worksheets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  subject: text("subject").notNull(),
  gradeLevel: text("grade_level").notNull(),
  questionType: text("question_type").notNull(),
  numQuestions: integer("num_questions").notNull(),
  difficulty: text("difficulty").notNull(),
  contentLanguage: text("content_language").notNull(),
  content: text("content").notNull(),
  answerKey: text("answer_key"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});
