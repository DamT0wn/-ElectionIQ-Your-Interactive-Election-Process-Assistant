const express = require('express');
const { body, validationResult } = require('express-validator');
const { generateQuizQuestion, explainQuizAnswer } = require('../services/vertexai');
const { saveQuizResult } = require('../services/firestore');

const router = express.Router();

const QUIZ_TOPICS = [
  'voter registration',
  'election day procedures',
  'types of elections',
  'electoral college',
  'ballot measures and propositions',
  'campaign finance',
  'voting rights history',
  'how votes are counted',
  'absentee and mail-in voting',
  'primary elections vs general elections',
  'the role of poll workers',
  'gerrymandering and redistricting',
];

/**
 * GET /api/quiz/topics
 * Get available quiz topics.
 */
router.get('/topics', (req, res) => {
  res.json({ topics: QUIZ_TOPICS });
});

/**
 * POST /api/quiz/generate
 * Generate a quiz question for a topic and difficulty.
 */
router.post(
  '/generate',
  [
    body('topic')
      .optional()
      .isString()
      .trim(),
    body('difficulty')
      .optional()
      .isIn(['easy', 'medium', 'hard'])
      .withMessage('Difficulty must be easy, medium, or hard'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const topic = req.body.topic || QUIZ_TOPICS[Math.floor(Math.random() * QUIZ_TOPICS.length)];
      const difficulty = req.body.difficulty || 'medium';

      const question = await generateQuizQuestion(topic, difficulty);
      res.json({ ...question, topic, difficulty });
    } catch (err) {
      console.error('Quiz generation error:', err);
      res.status(500).json({ error: 'Failed to generate quiz question' });
    }
  }
);

/**
 * POST /api/quiz/explain
 * Get an AI explanation for a quiz answer.
 */
router.post(
  '/explain',
  [
    body('question').isString().trim().notEmpty(),
    body('selectedAnswer').isString().trim().notEmpty(),
    body('correctAnswer').isString().trim().notEmpty(),
    body('isCorrect').isBoolean(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { question, selectedAnswer, correctAnswer, isCorrect } = req.body;
      const explanation = await explainQuizAnswer(question, selectedAnswer, correctAnswer, isCorrect);
      res.json({ explanation });
    } catch (err) {
      console.error('Quiz explanation error:', err);
      res.status(500).json({ error: 'Failed to generate explanation' });
    }
  }
);

/**
 * POST /api/quiz/submit
 * Submit quiz results for a user.
 */
router.post(
  '/submit',
  [
    body('userId').isString().trim().notEmpty(),
    body('score').isInt({ min: 0 }),
    body('totalQuestions').isInt({ min: 1 }),
    body('topic').isString().trim(),
    body('difficulty').isString().trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { userId, score, totalQuestions, topic, difficulty } = req.body;
      await saveQuizResult(userId, { score, totalQuestions, topic, difficulty });
      res.json({ success: true, message: 'Quiz result saved' });
    } catch (err) {
      console.error('Quiz submit error:', err);
      res.status(500).json({ error: 'Failed to save quiz result' });
    }
  }
);

module.exports = router;
