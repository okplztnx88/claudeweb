import Anthropic from '@anthropic-ai/sdk';
import { logger } from '../utils/logger';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ClaudeResponse {
  content: string;
  tokens: number;
}

export const sendMessageToClaude = async (
  messages: Message[],
  onChunk?: (chunk: string) => void
): Promise<ClaudeResponse> => {
  try {
    logger.info(`Sending ${messages.length} messages to Claude`);

    const stream = await anthropic.messages.stream({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4096,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    let fullContent = '';
    let totalTokens = 0;

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
        const text = chunk.delta.text;
        fullContent += text;
        if (onChunk) {
          onChunk(text);
        }
      }

      if (chunk.type === 'message_delta' && chunk.usage) {
        totalTokens = chunk.usage.output_tokens || 0;
      }
    }

    const finalMessage = await stream.finalMessage();
    totalTokens = finalMessage.usage.output_tokens;

    logger.info(`Claude response completed. Tokens: ${totalTokens}`);

    return {
      content: fullContent,
      tokens: totalTokens,
    };
  } catch (error) {
    logger.error('Error calling Claude API:', error);
    throw new Error('Failed to get response from Claude');
  }
};
