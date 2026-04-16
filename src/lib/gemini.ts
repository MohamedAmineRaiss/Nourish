// ─── Shared Gemini API helper with fallbacks ───

const GEMINI_MODELS = [
  'gemini-2.5-flash-lite',         // closest low-cost fallback
  'gemini-3-flash-preview',        // stronger fallback
  'gemini-2.5-flash',              // stable safety net
  'gemini-3.1-flash-lite-preview', // primary
  
] as const;

type GeminiCallOptions = {
  maxTokens?: number;
  temperature?: number;
};

type GeminiResult = {
  text: string | null;
  model: string | null;
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function shouldFallback(status: number): boolean {
  // Retry/fallback on transient capacity/rate-limit/server issues
  return status === 429 || status === 500 || status === 503;
}

async function generateWithModel(
  prompt: string,
  apiKey: string,
  model: string,
  options: GeminiCallOptions = {},
): Promise<GeminiResult> {
  const {
    maxTokens = 500,
    temperature = 0.3,
  } = options;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: maxTokens,
            temperature,
          },
        }),
      }
    );

    if (!res.ok) {
      const errorText = await res.text().catch(() => '');
      console.error(`Gemini error [${model}]:`, res.status, errorText);

      if (shouldFallback(res.status)) {
        throw new Error(`TRANSIENT_${res.status}`);
      }

      // Non-transient error: stop trying other models
      throw new Error(`NON_RETRYABLE_${res.status}`);
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;

    return { text, model };
  } catch (err) {
    // Re-throw so caller can decide whether to continue fallback chain
    throw err;
  }
}

export async function callGemini(
  prompt: string,
  apiKey: string,
  maxTokens = 500,
): Promise<string | null> {
  for (let i = 0; i < GEMINI_MODELS.length; i++) {
    const model = GEMINI_MODELS[i];

    try {
      const { text } = await generateWithModel(prompt, apiKey, model, {
        maxTokens,
        temperature: 0.3,
      });

      if (text) return text;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);

      // Stop immediately on non-retryable issues like bad key / bad request
      if (message.startsWith('NON_RETRYABLE_')) {
        console.error(`Stopping fallback chain on ${model}:`, message);
        return null;
      }

      // Small backoff before trying the next model
      if (i < GEMINI_MODELS.length - 1) {
        await sleep(250 * (i + 1));
      }
    }
  }

  return null;
}

export async function callGeminiJSON<T = any>(
  prompt: string,
  apiKey: string,
  maxTokens = 3000,
): Promise<T | null> {
  const text = await callGemini(prompt, apiKey, maxTokens);
  if (!text) return null;

  try {
    // Strip markdown code fences if present
    const clean = text
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/g, '')
      .trim();

    return JSON.parse(clean) as T;
  } catch {
    console.error('Gemini JSON parse error:', text.slice(0, 200));
    return null;
  }
}
