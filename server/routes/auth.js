import { Router } from "express";
import bcrypt from "bcryptjs";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { generateToken, authenticateToken } from "../middleware/auth.js";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: "Email, password, and name are required" });
    }

    const existing = db.select().from(users).where(eq(users.email, email)).get();
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = db
      .insert(users)
      .values({ email, passwordHash, name })
      .returning()
      .get();

    const token = generateToken(result);

    res.status(201).json({
      token,
      user: { id: result.id, email: result.email, name: result.name, uiLanguage: result.uiLanguage },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = db.select().from(users).where(eq(users.email, email)).get();
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        uiLanguage: user.uiLanguage,
        defaultGrade: user.defaultGrade,
        defaultSubject: user.defaultSubject,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

router.patch("/preferences", authenticateToken, async (req, res) => {
  try {
    const { uiLanguage, defaultGrade, defaultSubject } = req.body;
    const updates = {};

    if (uiLanguage) updates.uiLanguage = uiLanguage;
    if (defaultGrade) updates.defaultGrade = defaultGrade;
    if (defaultSubject) updates.defaultSubject = defaultSubject;
    updates.updatedAt = new Date().toISOString();

    const result = db
      .update(users)
      .set(updates)
      .where(eq(users.id, req.user.id))
      .returning()
      .get();

    res.json({
      user: {
        id: result.id,
        email: result.email,
        name: result.name,
        uiLanguage: result.uiLanguage,
        defaultGrade: result.defaultGrade,
        defaultSubject: result.defaultSubject,
      },
    });
  } catch (err) {
    console.error("Preferences error:", err);
    res.status(500).json({ error: "Failed to update preferences" });
  }
});

export default router;
