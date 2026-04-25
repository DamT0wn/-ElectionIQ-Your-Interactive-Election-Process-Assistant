const express = require('express');
const { body, validationResult } = require('express-validator');
const { sendChatMessage } = require('../services/vertexai');
const { saveChatHistory, getChatHistory } = require('../services/firestore');

const router = express.Router();

/**
 * POST /api/chat/message
 * Send a message to the AI chatbot.
 */
router.post(
  '/message',
  [
    body('message')
      .isString()
      .trim()
      .isLength({ min: 1, max: 2000 })
      .withMessage('Message must be between 1 and 2000 characters'),
    body('sessionId')
      .optional()
      .isString()
      .trim(),
    body('userId')
      .optional()
      .isString()
      .trim(),
    body('history')
      .optional()
      .isArray(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { message, sessionId, userId, history } = req.body;

      // If userId and sessionId provided, try to get history from Firestore
      let chatHistory = history || [];
      if (userId && sessionId && !history) {
        try {
          chatHistory = await getChatHistory(userId, sessionId);
        } catch (err) {
          console.warn('Could not load chat history from Firestore:', err.message);
        }
      }

      const result = await sendChatMessage(chatHistory, message);

      // Persist history if user is authenticated
      if (userId && sessionId) {
        try {
          await saveChatHistory(userId, sessionId, result.updatedHistory);
        } catch (err) {
          console.warn('Could not save chat history:', err.message);
        }
      }

      res.json({
        response: result.response,
        history: result.updatedHistory,
      });
    } catch (err) {
      console.error('Chat error:', err);
      res.status(500).json({ error: 'Failed to process chat message' });
    }
  }
);

/**
 * GET /api/chat/history/:userId/:sessionId
 * Get chat history for a session.
 */
router.get('/history/:userId/:sessionId', async (req, res) => {
  try {
    const { userId, sessionId } = req.params;
    const history = await getChatHistory(userId, sessionId);
    res.json({ history });
  } catch (err) {
    console.error('Error fetching chat history:', err);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

module.exports = router;
