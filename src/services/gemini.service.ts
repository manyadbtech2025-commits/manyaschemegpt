import { supabase } from '../lib/supabase';
import { generateAIResponse, convertMessagesToGeminiFormat } from './ai.service';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function askGemini(
  query: string,
  language: 'en' | 'hi' = 'en'
): Promise<string> {
  const messages = [{ role: 'user', content: query }];
  return generateAIResponse(
    convertMessagesToGeminiFormat(messages),
    undefined,
    language
  );
}

export async function streamGemini(
  query: string,
  userId: string,
  onChunk: (chunk: string) => void,
  signal?: AbortSignal
): Promise<string> {
  const messages = [{ role: 'user', content: query }];

  const contextualPrompt = buildContextualPrompt(userId);

  const requestBody = {
    contents: convertMessagesToGeminiFormat(messages),
    systemInstruction: {
      parts: [{ text: contextualPrompt }],
    },
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
    },
  };

  if (!GEMINI_API_KEY) {
    const fallback = await generateAIResponse(
      convertMessagesToGeminiFormat(messages),
      undefined,
      'en'
    );
    onChunk(fallback);
    return fallback;
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
        signal,
      }
    );

    if (!response.ok || !response.body) {
      const fallback = await generateAIResponse(
        convertMessagesToGeminiFormat(messages),
        undefined,
        'en'
      );
      onChunk(fallback);
      return fallback;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('[') && !trimmed.startsWith('{')) continue;

        try {
          const jsonStr = trimmed.endsWith(',') ? trimmed.slice(0, -1) : trimmed;
          const parsed = JSON.parse(jsonStr);
          const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            fullText += text;
            onChunk(text);
          }
        } catch {
          // partial JSON, skip
        }
      }
    }

    return fullText;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') throw error;
    console.error('Stream error:', error);
    const fallback = await generateAIResponse(
      convertMessagesToGeminiFormat(messages),
      undefined,
      'en'
    );
    onChunk(fallback);
    return fallback;
  }
}

async function buildContextualPrompt(userId: string): Promise<string> {
  let prompt = '';

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (profile) {
    prompt += `\n\nUSER PROFILE: Name: ${profile.full_name}, State: ${profile.state}, Category: ${profile.category}, Occupation: ${profile.occupation}`;
  }

  return prompt;
}
