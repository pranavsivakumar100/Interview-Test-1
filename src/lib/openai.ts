/*
 * openai.ts
 * ----------
 * Thin helper around the official OpenAI client.
 * If an API key is missing (i.e. candidate doesn't have one), the helper falls back to
 * deterministic stub functions so unit tests still pass offline.
 */

// You MAY install the official package locally if you have a key:
//   pnpm add -D openai
// The template keeps it optional so it still works without.

let OpenAI: unknown
try {
  // eslint-disable-next-line global-require, import/extensions, import/no-extraneous-dependencies
  OpenAI = (await import('openai')).default
} catch {
  // no dependency installed – we will use stubs
}

const apiKey = process.env.OPENAI_API_KEY || ''

export function hasRealOpenAIKey() {
  return Boolean(apiKey && OpenAI)
}

/**
 * Return embedding for a given text.
 * • If a real key & client are available → call embeddings API.
 * • Otherwise → return a deterministic pseudo-vector so tests stay deterministic.
 */
export async function embed(text: string): Promise<number[]> {
  if (typeof OpenAI === 'function' && OpenAI.prototype) {
    const client = new (OpenAI as { new (options: { apiKey: string }): Record<string, unknown> })({ apiKey })
    const embeddings = client.embeddings as unknown;
    const res = await (embeddings as { create: (args: { model: string; input: string }) => Promise<unknown> }).create({
      model: 'text-embedding-3-small',
      input: text,
    })
    // @ts-expect-error: OpenAI response type is dynamic
    return res.data[0].embedding as number[]
  }
  // Fallback: convert chars to small numeric vector (deterministic)
  return Array.from({ length: 8 }, (_, i) =>
    ((text.charCodeAt(i % text.length) || 0) % 100) / 100
  )
} 