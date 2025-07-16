'use server';

/**
 * @fileOverview A flow that generates AI-powered birthday message suggestions.
 *
 * - generateMessageSuggestions - A function that generates birthday message suggestions.
 * - GenerateMessageSuggestionsInput - The input type for the generateMessageSuggestions function.
 * - GenerateMessageSuggestionsOutput - The return type for the generateMessageSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMessageSuggestionsInputSchema = z.object({
  recipientName: z.string().describe('The name of the recipient.'),
  userMessage: z.string().describe('The message to personalize.'),
  birthday: z.string().describe('The birthday of the recipient.'),
});
export type GenerateMessageSuggestionsInput = z.infer<typeof GenerateMessageSuggestionsInputSchema>;

const GenerateMessageSuggestionsOutputSchema = z.object({
  suggestedMessage: z.string().describe('The AI-powered suggested birthday message.'),
});
export type GenerateMessageSuggestionsOutput = z.infer<typeof GenerateMessageSuggestionsOutputSchema>;

export async function generateMessageSuggestions(
  input: GenerateMessageSuggestionsInput
): Promise<GenerateMessageSuggestionsOutput> {
  return generateMessageSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMessageSuggestionsPrompt',
  input: {schema: GenerateMessageSuggestionsInputSchema},
  output: {schema: GenerateMessageSuggestionsOutputSchema},
  prompt: `You are a birthday message expert. Given the following information, generate a creative and personalized birthday message suggestion.

Recipient's Name: {{{recipientName}}}
Birthday: {{{birthday}}}
User Message: {{{userMessage}}}

Suggested Message:`,
});

const generateMessageSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateMessageSuggestionsFlow',
    inputSchema: GenerateMessageSuggestionsInputSchema,
    outputSchema: GenerateMessageSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
