import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext.jsx";

const SUBJECTS = ["math", "science", "reading", "socialStudies", "languageArts"];
const GRADES = ["K", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
const QUESTION_TYPES = ["multipleChoice", "fillInTheBlank", "trueFalse", "shortAnswer", "matching", "wordProblems"];
const NUM_QUESTIONS = [5, 10, 15, 20];
const DIFFICULTIES = ["easy", "medium", "hard"];

export default function WorksheetForm({ onGenerated }) {
  const { t } = useTranslation();
  const { authFetch } = useAuth();

  const [form, setForm] = useState({
    subject: "math",
    gradeLevel: "5",
    questionType: "multipleChoice",
    numQuestions: 10,
    difficulty: "medium",
    contentLanguage: "en",
    includeAnswerKey: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await authFetch("/api/worksheets/generate", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          subject: t(`subjects.${form.subject}`),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onGenerated(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">{t("form.title")}</h2>

      {error && (
        <div className="bg-red-50 text-red-700 px-3 py-2 rounded text-sm">{error}</div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t("form.subject")}</label>
        <select value={form.subject} onChange={update("subject")} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>{t(`subjects.${s}`)}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t("form.gradeLevel")}</label>
        <select value={form.gradeLevel} onChange={update("gradeLevel")} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
          {GRADES.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t("form.questionType")}</label>
        <select value={form.questionType} onChange={update("questionType")} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
          {QUESTION_TYPES.map((qt) => (
            <option key={qt} value={qt}>{t(`questionTypes.${qt}`)}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t("form.numQuestions")}</label>
        <select value={form.numQuestions} onChange={update("numQuestions")} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
          {NUM_QUESTIONS.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t("form.difficulty")}</label>
        <select value={form.difficulty} onChange={update("difficulty")} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
          {DIFFICULTIES.map((d) => (
            <option key={d} value={d}>{t(`difficulty.${d}`)}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t("form.contentLanguage")}</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" name="contentLanguage" value="en" checked={form.contentLanguage === "en"} onChange={update("contentLanguage")} className="text-indigo-600" />
            {t("languages.en")}
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" name="contentLanguage" value="es" checked={form.contentLanguage === "es"} onChange={update("contentLanguage")} className="text-indigo-600" />
            {t("languages.es")}
          </label>
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.includeAnswerKey} onChange={update("includeAnswerKey")} className="text-indigo-600" />
          {t("form.includeAnswerKey")}
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-2.5 px-4 rounded-md font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? t("form.generating") : t("form.generate")}
      </button>
    </form>
  );
}
