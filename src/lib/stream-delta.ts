/** Extract text only after checking the provider event at the runtime boundary. */
export function readStreamDelta(chunk: unknown): string {
  if (typeof chunk !== 'object' || chunk === null || !('choices' in chunk)) return '';
  if (!Array.isArray(chunk.choices)) return '';
  const choice: unknown = chunk.choices[0];
  if (typeof choice !== 'object' || choice === null || !('delta' in choice)) return '';
  const delta = choice.delta;
  if (typeof delta !== 'object' || delta === null || !('content' in delta)) return '';
  return typeof delta.content === 'string' ? delta.content : '';
}
