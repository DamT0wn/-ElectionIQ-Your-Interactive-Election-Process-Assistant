const { getDb } = require('../config/firebase');

const PROGRESS_COLLECTION = 'userProgress';

/**
 * Election steps that users can track.
 */
const ELECTION_STEPS = [
  { id: 'check_eligibility', label: 'Check Eligibility', order: 1 },
  { id: 'register_to_vote', label: 'Register to Vote', order: 2 },
  { id: 'verify_registration', label: 'Verify Registration', order: 3 },
  { id: 'find_polling_place', label: 'Find Polling Place', order: 4 },
  { id: 'learn_candidates', label: 'Research Candidates & Measures', order: 5 },
  { id: 'prepare_id', label: 'Prepare Voter ID', order: 6 },
  { id: 'cast_vote', label: 'Cast Your Vote', order: 7 },
  { id: 'track_ballot', label: 'Track Your Ballot', order: 8 },
];

/**
 * Get or initialize user progress document.
 * @param {string} userId
 * @returns {Promise<Object>}
 */
async function getUserProgress(userId) {
  const db = getDb();
  const docRef = db.collection(PROGRESS_COLLECTION).doc(userId);
  const doc = await docRef.get();

  if (!doc.exists) {
    const initial = {
      userId,
      completedSteps: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await docRef.set(initial);
    return initial;
  }

  return doc.data();
}

/**
 * Mark a step as completed or uncompleted.
 * @param {string} userId
 * @param {string} stepId
 * @param {boolean} completed
 * @returns {Promise<Object>} Updated progress
 */
async function updateStepProgress(userId, stepId, completed) {
  const db = getDb();
  const docRef = db.collection(PROGRESS_COLLECTION).doc(userId);
  const doc = await docRef.get();

  let completedSteps = [];
  if (doc.exists) {
    completedSteps = doc.data().completedSteps || [];
  }

  if (completed && !completedSteps.includes(stepId)) {
    completedSteps.push(stepId);
  } else if (!completed) {
    completedSteps = completedSteps.filter((s) => s !== stepId);
  }

  const updated = {
    userId,
    completedSteps,
    updatedAt: new Date().toISOString(),
  };

  await docRef.set(updated, { merge: true });
  return { ...updated, steps: ELECTION_STEPS };
}

/**
 * Save chat history for a user session.
 * @param {string} userId
 * @param {string} sessionId
 * @param {Array} history - Chat history array
 */
async function saveChatHistory(userId, sessionId, history) {
  const db = getDb();
  const docRef = db
    .collection('chatHistory')
    .doc(userId)
    .collection('sessions')
    .doc(sessionId);

  await docRef.set({
    history,
    updatedAt: new Date().toISOString(),
  });
}

/**
 * Get chat history for a user session.
 * @param {string} userId
 * @param {string} sessionId
 * @returns {Promise<Array>}
 */
async function getChatHistory(userId, sessionId) {
  const db = getDb();
  const docRef = db
    .collection('chatHistory')
    .doc(userId)
    .collection('sessions')
    .doc(sessionId);

  const doc = await docRef.get();
  if (!doc.exists) return [];
  return doc.data().history || [];
}

/**
 * Save a quiz result for a user.
 * @param {string} userId
 * @param {Object} result - Quiz result object
 */
async function saveQuizResult(userId, result) {
  const db = getDb();
  await db.collection('quizResults').doc(userId).collection('attempts').add({
    ...result,
    timestamp: new Date().toISOString(),
  });
}

module.exports = {
  getUserProgress,
  updateStepProgress,
  saveChatHistory,
  getChatHistory,
  saveQuizResult,
  ELECTION_STEPS,
};
