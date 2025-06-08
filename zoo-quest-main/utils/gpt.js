import { OPENAI_API_KEY } from '@env';

export async function askGPT(message, animal = 'lion') {
  try {
    const prompt = `You are ${animal}, a friendly zoo animal at a wildlife park. Answer questions in a fun, educational, and characterful way.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: prompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    console.log('🔍 GPT Raw Response:', JSON.stringify(data, null, 2));

    if (data.choices && data.choices.length > 0 && data.choices[0].message?.content) {
      return data.choices[0].message.content.trim();
    }

    if (data.error) {
      console.error('OpenAI Error:', data.error);
      return `Error from GPT: ${data.error.message}`;
    }

    return "ZooBot couldn't answer that. Try again!";
  } catch (error) {
    console.error('GPT Fetch Error:', error);
    return "ZooBot had a technical issue.";
  }
}
