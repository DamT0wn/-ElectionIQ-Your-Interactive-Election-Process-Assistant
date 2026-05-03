const express = require('express');
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const { transcribeAudio, synthesizeSpeech } = require('../services/speech');

const router = express.Router();

// Configure multer for audio upload (max 10MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

/**
 * POST /api/voice/transcribe
 * Transcribe audio to text using Speech-to-Text.
 */
router.post('/transcribe', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    const languageCode = req.body.languageCode || 'en-US';
    const encoding = req.body.encoding || 'WEBM_OPUS';
    const sampleRate = parseInt(req.body.sampleRateHertz, 10) || 48000;

    const transcript = await transcribeAudio(req.file.buffer, languageCode, encoding, sampleRate);

    res.json({ transcript, languageCode });
  } catch (err) {
    console.error('Transcription error:', err);
    res.status(500).json({ error: 'Failed to transcribe audio' });
  }
});

/**
 * POST /api/voice/synthesize
 * Convert text to speech using Text-to-Speech.
 */
router.post(
  '/synthesize',
  [
    body('text')
      .isString()
      .trim()
      .isLength({ min: 1, max: 5000 })
      .withMessage('Text must be between 1 and 5000 characters'),
    body('languageCode').optional().isString().trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { text, languageCode = 'en-US', voiceName } = req.body;

      const audioBuffer = await synthesizeSpeech(text, languageCode, voiceName);

      res.set({
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length,
        'Cache-Control': 'public, max-age=86400',
      });
      res.send(audioBuffer);
    } catch (err) {
      console.error('Synthesis error:', err);
      res.status(500).json({ error: 'Failed to synthesize speech' });
    }
  },
);

module.exports = router;
