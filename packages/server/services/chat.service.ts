import OpenAI from 'openai';
import { conversationRepository } from '../repositories/conversation.repository';

// Implementation Detail
const client = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
});

type chatresponse = {
   id: string;
   message: string;
};

// Public Interface
// Leaky Abstraction
export const chatservice = {
   async sendMessage(
      prompt: string,
      conversationId: string
   ): Promise<chatresponse> {
      const response = await client.responses.create({
         model: 'gpt-4o-mini',
         input: prompt,
         temperature: 0.2,
         max_output_tokens: 100,
         previous_response_id:
            conversationRepository.getLastResponseId(conversationId),
      });

      conversationRepository.setLastResponseId(conversationId, response.id);

      return {
         id: response.id,
         message: response.output_text,
      };
   },
};
