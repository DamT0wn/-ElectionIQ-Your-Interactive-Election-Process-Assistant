const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.error || `Request failed: ${response.status}`;
    const err = new Error(message);
    err.status = response.status;
    throw err;
  }

  // Check if response is audio
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('audio')) {
    return response.arrayBuffer();
  }

  return response.json();
}

// ── Chat API ──────────────────────────────────────────────────────────────────
export async function sendMessage(message, history = [], userId = null, sessionId = null) {
  return request('/api/chat/message', {
    method: 'POST',
    body: JSON.stringify({ message, history, userId, sessionId }),
  });
}

export async function getChatHistory(userId, sessionId) {
  return request(`/api/chat/history/${userId}/${sessionId}`);
}

// ── Voice API ─────────────────────────────────────────────────────────────────
export async function transcribeAudio(audioBlob, languageCode = 'en-US') {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'recording.webm');
  formData.append('languageCode', languageCode);

  const url = `${API_BASE}/api/voice/transcribe`;
  const response = await fetch(url, { method: 'POST', body: formData });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Transcription failed');
  }
  return response.json();
}

export async function synthesizeSpeech(text, languageCode = 'en-US') {
  return request('/api/voice/synthesize', {
    method: 'POST',
    body: JSON.stringify({ text, languageCode }),
  });
}

// ── Translation API ───────────────────────────────────────────────────────────
export async function translateText(text, targetLanguage, sourceLanguage = null) {
  return request('/api/translation/translate', {
    method: 'POST',
    body: JSON.stringify({ text, targetLanguage, sourceLanguage }),
  });
}

export async function detectLanguage(text) {
  return request('/api/translation/detect', {
    method: 'POST',
    body: JSON.stringify({ text }),
  });
}

export async function getLanguages() {
  return request('/api/translation/languages');
}

// ── Progress API ──────────────────────────────────────────────────────────────
export async function getUserProgress(userId) {
  return request(`/api/progress/${userId}`);
}

export async function updateStepProgress(userId, stepId, completed) {
  return request(`/api/progress/${userId}/step`, {
    method: 'PUT',
    body: JSON.stringify({ stepId, completed }),
  });
}

export async function getElectionSteps() {
  return request('/api/progress/steps');
}

// ── Quiz API ──────────────────────────────────────────────────────────────────
export async function getQuizTopics() {
  return request('/api/quiz/topics');
}

export async function generateQuizQuestion(topic, difficulty) {
  return request('/api/quiz/generate', {
    method: 'POST',
    body: JSON.stringify({ topic, difficulty }),
  });
}

export async function explainQuizAnswer(question, selectedAnswer, correctAnswer, isCorrect) {
  return request('/api/quiz/explain', {
    method: 'POST',
    body: JSON.stringify({ question, selectedAnswer, correctAnswer, isCorrect }),
  });
}

export async function submitQuizResult(userId, result) {
  return request('/api/quiz/submit', {
    method: 'POST',
    body: JSON.stringify({ userId, ...result }),
  });
}

// ── Calendar API ──────────────────────────────────────────────────────────────
export async function getElectionEvents(year) {
  return request(`/api/calendar/events?year=${year}`);
}

// ── Health API ────────────────────────────────────────────────────────────────
export async function checkHealth() {
  return request('/api/health');
}
