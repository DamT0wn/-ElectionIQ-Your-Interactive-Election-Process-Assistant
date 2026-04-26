import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Import after setting up mock
const { sendMessage, checkHealth } = await import('../services/api.js');

describe('API service', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('checkHealth returns healthy status', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => ({ status: 'healthy', service: 'ElectionIQ API' }),
    });

    const result = await checkHealth();
    expect(result.status).toBe('healthy');
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/health'),
      expect.any(Object)
    );
  });

  it('sendMessage calls correct endpoint', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => ({
        response: 'Voter registration is important.',
        history: [],
      }),
    });

    const result = await sendMessage('What is voter registration?');
    expect(result.response).toBe('Voter registration is important.');
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/chat/message'),
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('throws error with message when response is not ok', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      headers: { get: () => 'application/json' },
      json: async () => ({ error: 'Message must be between 1 and 2000 characters' }),
    });

    await expect(sendMessage('')).rejects.toThrow('Message must be between 1 and 2000 characters');
  });

  it('throws generic error when response body is not JSON', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      headers: { get: () => 'text/html' },
      json: async () => { throw new Error('not json'); },
    });

    await expect(checkHealth()).rejects.toThrow('Request failed: 500');
  });
});
