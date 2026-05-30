interface ChatCompletionMessage {
  role: 'system' | 'user';
  content: string;
}

interface ChatCompletionResponse {
  choices?: {
    message?: {
      content?: string;
    };
  }[];
}

export async function generateKopiBotJson(messages: ChatCompletionMessage[]) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.2,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI chat completion failed: ${response.status} ${errorText}`);
  }

  const data = await response.json() as ChatCompletionResponse;
  return data.choices?.[0]?.message?.content || null;
}
