import axios from 'axios';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function suggestFixForIssue(issueBody, issueTitle, language = 'JavaScript') {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY not set in environment');
  }

  const prompt = `You are a helpful open-source developer. 
  
Issue Title: ${issueTitle}
Issue Description: ${issueBody}
Repository Language: ${language}

Provide a concise solution to this issue in ${language}. Include:
1. Root cause analysis
2. Recommended fix with code snippet
3. Testing approach

Keep the response focused and practical.`;

  try {
    const response = await axios.post(
      OPENROUTER_URL,
      {
        model: 'openrouter/auto',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 1000,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://contriflow.dev',
          'X-Title': 'ContriFlow CLI',
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    throw new Error(`AI service error: ${error.message}`);
  }
}

export async function generateCommitMessage(issueTitle, fixDescription) {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY not set in environment');
  }

  const prompt = `Generate a concise, professional git commit message for this fix:
  
Issue: ${issueTitle}
Fix: ${fixDescription}

Format: 
<type>(<scope>): <subject>

Keep it under 50 characters for subject.`;

  try {
    const response = await axios.post(
      OPENROUTER_URL,
      {
        model: 'openrouter/auto',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 100,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://contriflow.dev',
          'X-Title': 'ContriFlow CLI',
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    throw new Error(`AI service error: ${error.message}`);
  }
}
