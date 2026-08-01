import OpenAI from "openai";
import { streamPrint } from "../utils/streamPrinter";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function explainTool(
  input: string,
  context: any
): Promise<string> {

  let finalText = "";

  const stream = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.4,
    stream: true,
    messages: [
      {
        role: "system",
        content:
          "Explain the following topic clearly, step by step, in simple language.",
      },
      {
        role: "user",
        content: input,
      },
    ],
  });

  // console.log("stream", stream)
  
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
