import { OPENAI_API_KEY } from '@env';
import { animalProfiles } from './animalProfiles';

export async function enhancedAskGPT(message, animal = 'lion', options = {}) {
  try {
    const {
      userAge,
      includeConservation = true, 
      includeScientific = true,
      conversationHistory = []
    } = options;
    
    const animalData = animalProfiles[animal] || animalProfiles['lion'];
    
    // Adjust content based on user age if available
    const contentLevel = userAge ? 
      userAge < 8 ? 'simple and fun, avoiding complex terms' : 
      userAge < 13 ? 'educational but accessible for pre-teens' :
      'detailed and scientifically accurate' : 'balanced and educational';
    
    // Build a rich system prompt with animal personality and knowledge
    const systemPrompt = `
You are ${animalData.name} (${animalData.scientificName}), a friendly zoo animal with these personality traits: ${animalData.personalityTraits.join(', ')}.

YOUR KNOWLEDGE:
- You live in ${animalData.habitatDescription}
- You're a ${animalData.dietType} with a lifespan of about ${animalData.lifespan} years
- Your conservation status: ${animalData.conservationStatus}
${includeConservation ? `- Conservation challenges you face: ${animalData.conservationChallenges.join(', ')}` : ''}
${includeScientific ? `- Scientific details: You belong to the ${animalData.category} category with special abilities like ${animalData.specialAbilities.join(', ')}` : ''}

YOUR ROLE:
- Answer in a ${animalData.voiceCharacteristics} voice, staying in character
- Be ${contentLevel} in your explanations
- Share fun facts about yourself and your species when relevant
- Promote conservation awareness and ecological understanding
- Keep answers concise (1-3 paragraphs) and engaging
- If asked about something you don't know, respond as your animal character might, rather than saying you don't have that information
`;

    // Combine conversation history with new message
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages,
        temperature: 0.7,
        max_tokens: 800
      })
    });

    const data = await response.json();
    console.log('🔍 Enhanced GPT Response:', JSON.stringify(data, null, 2));

    if (data.choices && data.choices.length > 0 && data.choices[0].message?.content) {
      return data.choices[0].message.content.trim();
    }

    if (data.error) {
      console.error('OpenAI Error:', data.error);
      return `Sorry, I'm having trouble connecting to my animal knowledge. Let's try again in a moment!`;
    }

    return "I couldn't find an answer for that. Let's try a different question!";
  } catch (error) {
    console.error('Enhanced GPT Fetch Error:', error);
    return "I'm having a little trouble with my animal brain right now. Let's chat again in a moment!";
  }
} 