// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { readStreamDelta } from './stream-delta';

describe('provider streaming event boundary', () => {
  it('preserves text, whitespace and unicode from the first completion choice', () => {
    expect(readStreamDelta({ choices: [{ delta: { content: ' Olá, món 🌌\n' } }] })).toBe(' Olá, món 🌌\n');
  });
  it.each([
    null, undefined, 42, 'data: [DONE]', {}, { choices: null }, { choices: {} },
    { choices: [] }, { choices: [null] }, { choices: [42] },
    { choices: [{}] }, { choices: [{ delta: null }] }, { choices: [{ delta: {} }] },
    { choices: [{ delta: { content: 42 } }] },
    { choices: [{ delta: { content: { text: 'not a text delta' } } }] },
    { choices: [{ delta: { role: 'assistant' } }] },
  ])('ignores a non-text or malformed event without throwing: %j', (event) => {
    expect(readStreamDelta(event)).toBe('');
  });
  it('does not forward other completion choices', () => {
    expect(readStreamDelta({ choices: [{ delta: {} }, { delta: { content: 'other' } }] })).toBe('');
  });
});
