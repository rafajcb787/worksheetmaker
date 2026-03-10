import OpenAI from "openai";

let openai;
function getClient() {
  if (!openai) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openai;
}

export async function generateWorksheet({
  subject,
  gradeLevel,
  questionType,
  numQuestions,
  difficulty,
  contentLanguage,
  includeAnswerKey,
}) {
  const language = contentLanguage === "es" ? "Spanish" : "English";
  const answerKeyInstruction = includeAnswerKey
    ? "Include an answer key section at the end, wrapped in a div with class 'answer-key'."
    : "Do not include an answer key.";

  const prompt = `You are a worksheet generator for teachers.

Create a ${difficulty} ${subject} worksheet for grade ${gradeLevel}.
Include ${numQuestions} ${questionType} questions.
Language: ${language}.
${answerKeyInstruction}

Format the output in clean HTML suitable for printing. Use these guidelines:
- Wrap the entire worksheet in a <div class="worksheet">
- Include a title in an <h1> tag
- Include a line for student name and date
- Number all questions
- Use clean, readable formatting
- If there's an answer key, separate it clearly from the questions

Return ONLY the HTML content, no markdown code fences.`;

  const response = await getClient().chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 2000,
    temperature: 0.7,
  });

  const content = response.choices[0].message.content;

  // Extract answer key if present
  let worksheetContent = content;
  let answerKey = null;

  const answerKeyMatch = content.match(
    /<div class="answer-key">([\s\S]*?)<\/div>/i
  );
  if (answerKeyMatch) {
    answerKey = answerKeyMatch[0];
    worksheetContent = content.replace(answerKeyMatch[0], "").trim();
  }

  // Generate a title from the content
  const titleMatch = content.match(/<h1>(.*?)<\/h1>/i);
  const title = titleMatch
    ? titleMatch[1]
    : `${subject} - Grade ${gradeLevel}`;

  return { content: worksheetContent, answerKey, title };
}
