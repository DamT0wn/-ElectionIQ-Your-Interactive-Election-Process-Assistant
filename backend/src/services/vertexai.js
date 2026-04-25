/**
 * Gemini API service — uses Google Generative Language REST API directly.
 * This avoids Vertex AI SDK credential/model availability issues.
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
const GEMINI_API_BASE = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}`;

const SYSTEM_INSTRUCTION = `You are ElectionIQ, a friendly and knowledgeable AI assistant specializing in election processes, voter rights, and civic education.
Your role is to:
- Explain election processes clearly and neutrally in plain, accessible language
- Help users understand voter registration, polling procedures, candidate selection, and vote counting
- Answer questions about election timelines and important dates
- Provide unbiased information about how democratic elections work
- Support multiple languages when asked
- Break down complex civics concepts into simple steps
- Always encourage civic participation and respect diverse viewpoints
- Never endorse specific candidates or parties
- If asked about specific election results, direct users to official sources
Keep responses concise, warm, and encouraging. Use numbered lists and bullet points for clarity.`;

/**
 * Call Gemini REST API
 */
async function callGemini(contents, generationConfig = {}) {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set in environment variables.');
  }

  const url = `${GEMINI_API_BASE}:generateContent?key=${GEMINI_API_KEY}`;

  const body = {
    system_instruction: {
      parts: [{ text: SYSTEM_INSTRUCTION }]
    },
    contents,
    generationConfig: {
      maxOutputTokens: 2048,
      temperature: 0.7,
      topP: 0.8,
      ...generationConfig,
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    ],
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`Gemini API error ${response.status}: ${JSON.stringify(err)}`);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

/**
 * Send a chat message and maintain conversation history.
 */
async function sendChatMessage(history, userMessage) {
  // Convert history format: [{role, parts}] — already correct for Gemini
  const contents = [
    ...(history || []),
    { role: 'user', parts: [{ text: userMessage }] },
  ];

  const responseText = await callGemini(contents);

  const updatedHistory = [
    ...(history || []),
    { role: 'user', parts: [{ text: userMessage }] },
    { role: 'model', parts: [{ text: responseText }] },
  ];

  return { response: responseText, updatedHistory };
}

/**
 * Generate a quiz question for a given topic and difficulty.
 */
async function generateQuizQuestion(topic, difficulty) {
  const prompt = `Generate a ${difficulty} multiple-choice quiz question about "${topic}" related to elections and civic education.
Return ONLY valid JSON in this exact format (no markdown, no explanation):
{
  "question": "Question text here?",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctIndex": 0,
  "explanation": "Brief explanation of why the answer is correct."
}`;

  const text = await callGemini([{ role: 'user', parts: [{ text: prompt }] }]);
  const cleaned = text.replace(/```json\n?|```\n?/g, '').trim();
  return JSON.parse(cleaned);
}

/**
 * Generate an explanation for a quiz answer.
 */
async function explainQuizAnswer(question, selectedAnswer, correctAnswer, isCorrect) {
  const prompt = `A user answered an election quiz question.
Question: "${question}"
User's answer: "${selectedAnswer}"
Correct answer: "${correctAnswer}"
Result: ${isCorrect ? 'Correct!' : 'Incorrect'}

In 2-3 short sentences, give an encouraging explanation of the correct answer to help the user learn. Be friendly and educational.`;

  return callGemini([{ role: 'user', parts: [{ text: prompt }] }]);
}

module.exports = { sendChatMessage, generateQuizQuestion, explainQuizAnswer };
