const express = require('express');
const { body, param, validationResult } = require('express-validator');
const { getUserProgress, updateStepProgress, ELECTION_STEPS } = require('../services/firestore');

const router = express.Router();

/**
 * GET /api/progress/steps
 * Get all election step definitions.
 */
router.get('/steps', (req, res) => {
  res.json({ steps: ELECTION_STEPS });
});

/**
 * GET /api/progress/:userId
 * Get user progress data.
 */
router.get(
  '/:userId',
  [param('userId').isString().trim().notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const progress = await getUserProgress(req.params.userId);
      res.json({ ...progress, steps: ELECTION_STEPS });
    } catch (err) {
      console.error('Error fetching progress:', err);
      res.status(500).json({ error: 'Failed to fetch progress' });
    }
  }
);

/**
 * PUT /api/progress/:userId/step
 * Update a step's completion status.
 */
router.put(
  '/:userId/step',
  [
    param('userId').isString().trim().notEmpty(),
    body('stepId')
      .isString()
      .trim()
      .isIn(ELECTION_STEPS.map((s) => s.id))
      .withMessage('Invalid step ID'),
    body('completed').isBoolean(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { stepId, completed } = req.body;
      const result = await updateStepProgress(req.params.userId, stepId, completed);
      res.json(result);
    } catch (err) {
      console.error('Error updating progress:', err);
      res.status(500).json({ error: 'Failed to update progress' });
    }
  }
);

module.exports = router;
