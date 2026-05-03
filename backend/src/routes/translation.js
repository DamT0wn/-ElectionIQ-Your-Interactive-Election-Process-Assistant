const express = require('express');
const { body, validationResult } = require('express-validator');
const {
  translateText,
  detectLanguage,
  getSupportedLanguages,
  SUPPORTED_UI_LANGUAGES,
} = require('../services/translation');

const router = express.Router();

/**
 * POST /api/translation/translate
 * Translate text to a target language.
 */
router.post(
  '/translate',
  [
    body('text')
      .isString()
      .trim()
      .isLength({ min: 1, max: 5000 })
      .withMessage('Text must be between 1 and 5000 characters'),
    body('targetLanguage')
      .isString()
      .trim()
      .isLength({ min: 2, max: 10 })
      .withMessage('Target language code is required'),
    body('sourceLanguage').optional().isString().trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { text, targetLanguage, sourceLanguage } = req.body;
      const result = await translateText(text, targetLanguage, sourceLanguage);
      res.json(result);
    } catch (err) {
      console.error('Translation error:', err);
      res.status(500).json({ error: 'Failed to translate text' });
    }
  },
);

/**
 * POST /api/translation/detect
 * Detect the language of a text.
 */
router.post(
  '/detect',
  [body('text').isString().trim().isLength({ min: 1, max: 5000 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { text } = req.body;
      const result = await detectLanguage(text);
      res.json(result);
    } catch (err) {
      console.error('Language detection error:', err);
      res.status(500).json({ error: 'Failed to detect language' });
    }
  },
);

/**
 * GET /api/translation/languages
 * Get supported UI languages for the app.
 */
router.get('/languages', (req, res) => {
  res.json({ languages: SUPPORTED_UI_LANGUAGES });
});

/**
 * GET /api/translation/all-languages
 * Get all languages supported by the Translation API.
 */
router.get('/all-languages', async (req, res) => {
  try {
    const languages = await getSupportedLanguages();
    res.json({ languages });
  } catch (err) {
    console.error('Error fetching languages:', err);
    res.status(500).json({ error: 'Failed to fetch supported languages' });
  }
});

module.exports = router;
