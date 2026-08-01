import OpenAI from "openai";
import { streamPrint } from "../utils/streamPrinter";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function summarizeTool(input: string, context: any): Promise<string> {
  let finalText = "";

  const stream = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.3,
    stream: true,
    messages: [
      {
        role: "system",
        content: "Summarize the following text clearly and concisely.",
      },
      {
        role: "user",
        content: input,
      },
    ],
  });

  const writer = context?.getStreamWriter?.();

  for await (const chunk of stream) {
    // console.log('chunk', chunk)

    const delta = chunk.choices[0]?.delta?.content;

    if (delta) {
      // 🔥 Stream to WebSocket if available
      if (writer) {
        writer(delta);
      }

      finalText += delta;
    }
  }

  return finalText;
}
