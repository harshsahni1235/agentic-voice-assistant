import { PlannerDecision } from "../core/types";
import OpenAI from "openai";
import "dotenv/config";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function plannerAgent(input: string): Promise<PlannerDecision> {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0,
    messages: [
      {
        role: "system",
        content: `
        You are a planning agent.
        Your job is to analyze user input and decide intent.

        Allowed intents:
        - explain
        - summarize
        - narrate

        Tool mapping rules (MANDATORY):
        - explain → tools = ["explain_tool"]
        - summarize → tools = ["summarize_tool"]
        - narrate → tools = ["tts_tool"] and requiresApproval = true

        Rules:
        - ALWAYS choose exactly ONE intent.
        - ALWAYS include at least ONE tool.
        - NEVER return an empty tools array.
        - Respond ONLY with VALID JSON.
        - NO explanations.
        - NO markdown.

        JSON Schema:
        {
        "intent": "explain | summarize | narrate",
        "requiresApproval": boolean,
        "tools": string[]
        }
        `,
      },
      {
        role: "user",
        content: input,
      },
    ],
  });

  const content = response.choices[0].message.content;
  // console.log("response:", response);
  console.log("Planner Agent Raw Response:", content);

  if (!content) {
    throw new Error("Planner returned empty response");
  }

  return JSON.parse(content) as PlannerDecision;
}
