const request = require('supertest');
const app = require('../app');

jest.mock('../services/vertexai', () => ({
  sendChatMessage: jest.fn(),
  generateQuizQuestion: jest.fn().mockResolvedValue({
    question: 'What is the Electoral College?',
    options: [
      'A university',
      'A system for electing the president',
      'A voting machine',
      'A political party',
    ],
    correctIndex: 1,
    explanation: 'The Electoral College is the system used to elect the US president.',
  }),
  explainQuizAnswer: jest
    .fn()
    .mockResolvedValue(
      'Great job! The Electoral College is indeed the system used to elect the US president.',
    ),
}));

jest.mock('../services/firestore', () => ({
  saveQuizResult: jest.fn().mockResolvedValue(undefined),
  getChatHistory: jest.fn(),
  saveChatHistory: jest.fn(),
  getUserProgress: jest.fn(),
  updateStepProgress: jest.fn(),
  ELECTION_STEPS: [],
}));

describe('GET /api/quiz/topics', () => {
  it('returns array of quiz topics', async () => {
    const res = await request(app).get('/api/quiz/topics');
    expect(res.statusCode).toBe(200);
    expect(res.body.topics).toBeInstanceOf(Array);
    expect(res.body.topics.length).toBeGreaterThan(0);
  });
});

describe('POST /api/quiz/generate', () => {
  it('generates a quiz question with valid inputs', async () => {
    const res = await request(app)
      .post('/api/quiz/generate')
      .send({ topic: 'electoral college', difficulty: 'medium' });
    expect(res.statusCode).toBe(200);
    expect(res.body.question).toBeDefined();
    expect(res.body.options).toHaveLength(4);
    expect(typeof res.body.correctIndex).toBe('number');
  });

  it('returns 400 for invalid difficulty', async () => {
    const res = await request(app).post('/api/quiz/generate').send({ difficulty: 'impossible' });
    expect(res.statusCode).toBe(400);
  });

  it('works without topic (random topic)', async () => {
    const res = await request(app).post('/api/quiz/generate').send({ difficulty: 'easy' });
    expect(res.statusCode).toBe(200);
  });
});

describe('POST /api/quiz/explain', () => {
  it('returns explanation for a quiz answer', async () => {
    const res = await request(app).post('/api/quiz/explain').send({
      question: 'What is the Electoral College?',
      selectedAnswer: 'A system for electing the president',
      correctAnswer: 'A system for electing the president',
      isCorrect: true,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.explanation).toBeDefined();
  });

  it('returns 400 when required fields are missing', async () => {
    const res = await request(app).post('/api/quiz/explain').send({ question: 'What is voting?' });
    expect(res.statusCode).toBe(400);
  });
});
