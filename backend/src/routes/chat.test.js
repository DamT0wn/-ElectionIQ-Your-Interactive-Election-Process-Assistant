const request = require('supertest');
const app = require('../app');

// Mock the Gemini service so tests don't hit real API
jest.mock('../services/vertexai', () => ({
  sendChatMessage: jest.fn().mockResolvedValue({
    response: 'Voter registration is the process of enrolling to vote.',
    updatedHistory: [
      { role: 'user', parts: [{ text: 'What is voter registration?' }] },
      { role: 'model', parts: [{ text: 'Voter registration is the process of enrolling to vote.' }] },
    ],
  }),
  generateQuizQuestion: jest.fn(),
  explainQuizAnswer: jest.fn(),
}));

// Mock Firestore so tests don't need real credentials
jest.mock('../services/firestore', () => ({
  saveChatHistory: jest.fn().mockResolvedValue(undefined),
  getChatHistory: jest.fn().mockResolvedValue([]),
  getUserProgress: jest.fn(),
  updateStepProgress: jest.fn(),
  saveQuizResult: jest.fn(),
  ELECTION_STEPS: [],
}));

describe('POST /api/chat/message', () => {
  it('returns 400 when message is missing', async () => {
    const res = await request(app)
      .post('/api/chat/message')
      .send({});
    expect(res.statusCode).toBe(400);
  });

  it('returns 400 when message is empty string', async () => {
    const res = await request(app)
      .post('/api/chat/message')
      .send({ message: '' });
    expect(res.statusCode).toBe(400);
  });

  it('returns 400 when message exceeds 2000 characters', async () => {
    const res = await request(app)
      .post('/api/chat/message')
      .send({ message: 'a'.repeat(2001) });
    expect(res.statusCode).toBe(400);
  });

  it('returns 200 with AI response for valid message', async () => {
    const res = await request(app)
      .post('/api/chat/message')
      .send({ message: 'What is voter registration?', userId: null, sessionId: null });
    expect(res.statusCode).toBe(200);
    expect(res.body.response).toBeDefined();
    expect(res.body.history).toBeInstanceOf(Array);
  });

  it('accepts optional history array', async () => {
    const res = await request(app)
      .post('/api/chat/message')
      .send({
        message: 'Tell me more',
        history: [{ role: 'user', parts: [{ text: 'Hello' }] }],
        userId: null,
        sessionId: null,
      });
    expect(res.statusCode).toBe(200);
  });
});

describe('GET /api/chat/history/:userId/:sessionId', () => {
  it('returns chat history for a user session', async () => {
    const res = await request(app)
      .get('/api/chat/history/user123/session456');
    expect(res.statusCode).toBe(200);
    expect(res.body.history).toBeInstanceOf(Array);
  });
});
