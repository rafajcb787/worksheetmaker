import { Router } from "express";
import { db } from "../db/index.js";
import { worksheets } from "../db/schema.js";
import { eq, and, desc } from "drizzle-orm";
import { authenticateToken } from "../middleware/auth.js";
import { generateWorksheet } from "../services/chatgpt.js";

const router = Router();

router.use(authenticateToken);

router.get("/", (req, res) => {
  try {
    const results = db
      .select()
      .from(worksheets)
      .where(eq(worksheets.userId, req.user.id))
      .orderBy(desc(worksheets.createdAt))
      .all();

    res.json(results);
  } catch (err) {
    console.error("List worksheets error:", err);
    res.status(500).json({ error: "Failed to fetch worksheets" });
  }
});

router.get("/:id", (req, res) => {
  try {
    const worksheet = db
      .select()
      .from(worksheets)
      .where(
        and(
          eq(worksheets.id, parseInt(req.params.id)),
          eq(worksheets.userId, req.user.id)
        )
      )
      .get();

    if (!worksheet) {
      return res.status(404).json({ error: "Worksheet not found" });
    }

    res.json(worksheet);
  } catch (err) {
    console.error("Get worksheet error:", err);
    res.status(500).json({ error: "Failed to fetch worksheet" });
  }
});

router.post("/generate", async (req, res) => {
  try {
    const {
      subject,
      gradeLevel,
      questionType,
      numQuestions,
      difficulty,
      contentLanguage,
      includeAnswerKey,
    } = req.body;

    if (!subject || !gradeLevel || !questionType || !numQuestions || !difficulty || !contentLanguage) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const { content, answerKey, title } = await generateWorksheet({
      subject,
      gradeLevel,
      questionType,
      numQuestions: parseInt(numQuestions),
      difficulty,
      contentLanguage,
      includeAnswerKey: includeAnswerKey !== false,
    });

    const result = db
      .insert(worksheets)
      .values({
        userId: req.user.id,
        title,
        subject,
        gradeLevel,
        questionType,
        numQuestions: parseInt(numQuestions),
        difficulty,
        contentLanguage,
        content,
        answerKey,
      })
      .returning()
      .get();

    res.status(201).json(result);
  } catch (err) {
    console.error("Generate worksheet error:", err);
    if (err.status === 429) {
      return res.status(429).json({ error: "Rate limited. Please wait a moment and try again." });
    }
    res.status(500).json({ error: "Failed to generate worksheet" });
  }
});

router.delete("/:id", (req, res) => {
  try {
    const worksheet = db
      .select()
      .from(worksheets)
      .where(
        and(
          eq(worksheets.id, parseInt(req.params.id)),
          eq(worksheets.userId, req.user.id)
        )
      )
      .get();

    if (!worksheet) {
      return res.status(404).json({ error: "Worksheet not found" });
    }

    db.delete(worksheets)
      .where(eq(worksheets.id, parseInt(req.params.id)))
      .run();

    res.json({ message: "Worksheet deleted" });
  } catch (err) {
    console.error("Delete worksheet error:", err);
    res.status(500).json({ error: "Failed to delete worksheet" });
  }
});

export default router;
