const { VertexAI } = require('@google-cloud/vertexai');

let vertexAI = null;
let generativeModel = null;

/**
 * Initialize Vertex AI client.
 */
function getVertexAI() {
  if (!vertexAI) {
    vertexAI = new VertexAI({
      project: process.env.GOOGLE_CLOUD_PROJECT_ID,
      location: process.env.VERTEX_AI_LOCATION || 'us-central1',
    });
    generativeModel = vertexAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || 'gemini-1.5-pro',
      systemInstruction: {
        parts: [
          {
            text: `You are ElectionIQ, a friendly and knowledgeable AI assistant specializing in election processes, voter rights, and civic education. 
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
Keep responses concise, warm, and encouraging. Use numbered lists and bullet points for clarity.`,
          },
        ],
      },
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.7,
        topP: 0.8,
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      ],
    });
  }
  return { vertexAI, generativeModel };
}

/**
 * Send a chat message and maintain conversation history.
 * @param {Array<{role: string, parts: Array<{text: string}>}>} history - Previous messages
 * @param {string} userMessage - The new user message
 * @returns {Promise<{response: string, updatedHistory: Array}>}
 */
async function sendChatMessage(history, userMessage) {
  const { generativeModel } = getVertexAI();

  const chat = generativeModel.startChat({
    history: history || [],
  });

  const result = await chat.sendMessage(userMessage);
  const responseText = result.response.candidates[0].content.parts[0].text;

  const updatedHistory = [
    ...(history || []),
    { role: 'user', parts: [{ text: userMessage }] },
    { role: 'model', parts: [{ text: responseText }] },
  ];

  return { response: responseText, updatedHistory };
}

/**
 * Generate a quiz question using Gemini for a given topic and difficulty.
 * @param {string} topic - Election topic (e.g., 'voter registration')
 * @param {string} difficulty - 'easy' | 'medium' | 'hard'
 * @returns {Promise<Object>} Quiz question object
 */
async function generateQuizQuestion(topic, difficulty) {
  const { generativeModel } = getVertexAI();

  const prompt = `Generate a ${difficulty} multiple-choice quiz question about "${topic}" related to elections and civic education.
Return ONLY valid JSON in this exact format (no markdown, no explanation):
{
  "question": "Question text here?",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctIndex": 0,
  "explanation": "Brief explanation of why the answer is correct."
}`;

  const result = await generativeModel.generateContent(prompt);
  const text = result.response.candidates[0].content.parts[0].text;

  // Strip any potential markdown fences
  const cleaned = text.replace(/```json\n?|```\n?/g, '').trim();
  return JSON.parse(cleaned);
}

/**
 * Generate an explanation for a quiz answer.
 * @param {string} question
 * @param {string} selectedAnswer
 * @param {string} correctAnswer
 * @param {boolean} isCorrect
 * @returns {Promise<string>}
 */
async function explainQuizAnswer(question, selectedAnswer, correctAnswer, isCorrect) {
  const { generativeModel } = getVertexAI();

  const prompt = `A user answered an election quiz question.
Question: "${question}"
User's answer: "${selectedAnswer}"
Correct answer: "${correctAnswer}"
Result: ${isCorrect ? 'Correct!' : 'Incorrect'}

In 2-3 short sentences, give an encouraging explanation of the correct answer to help the user learn. Be friendly and educational.`;

  const result = await generativeModel.generateContent(prompt);
  return result.response.candidates[0].content.parts[0].text;
}

module.exports = { sendChatMessage, generateQuizQuestion, explainQuizAnswer, getVertexAI };
