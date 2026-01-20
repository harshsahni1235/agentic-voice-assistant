import { inputGuardrailAgent } from "../agent/guardrail.agent";
import { plannerAgent } from "../agent/planner.agent";
import { runtimeContext } from "../context/runtimeContext";
import { explainTool } from "../tools/explain.tool";
import { summarizeTool } from "../tools/summarize.tool";
import { ttsTool } from "../tools/tts.tool";
import { OrchestratorInput, OrchestratorResult } from "./types";

class Orchestrator {
  async run(input: OrchestratorInput): Promise<OrchestratorResult> {
    console.log("Orchestrator received input:", input.input);

    // 🔁 Human-in-the-Loop: Resume pending action
    if (runtimeContext.hasPendingAction()) {
      const userDecision = input.input.trim().toLowerCase();

      if (userDecision === "approve") {
        const pending = runtimeContext.getPendingAction();
        runtimeContext.clearPendingAction();

        if (pending?.tool === "tts_tool") {
          const result = await ttsTool(pending.content);
          return { output: result };
        }
      }

      if (userDecision === "reject") {
        runtimeContext.clearPendingAction();
        return { output: "Action cancelled by user." };
      }

      return {
        output: "Pending approval. Please type 'approve' or 'reject'.",
      };
    }

    // 1️⃣ Input Guardrail
    const guardrail = await inputGuardrailAgent(input.input);
    console.log("Guardrail result:", guardrail);

    if (!guardrail.allowed) {
      return {
        output: `Input rejected: ${guardrail.reason}`,
      };
    }

    // 2️⃣ Planner decides what to do
    const decision = await plannerAgent(input.input);
    console.log("Planner decision:", decision);

    let resultText = "";

    // 3️⃣ Execute tools dynamically
    for (const tool of decision.tools) {
      switch (tool) {
        case "explain_tool":
          resultText = await explainTool(input.input);
          runtimeContext.setLastAgentOutput(resultText);
          break;

        case "summarize_tool":
          resultText = await summarizeTool(input.input);
          runtimeContext.setLastAgentOutput(resultText);
          break;

        case "tts_tool":
          if (decision.requiresApproval) {
            const contentToNarrate = runtimeContext.getLastAgentOutput() ?? input.input;

            runtimeContext.setPendingAction({
            tool: "tts_tool",
            content: contentToNarrate,
          });


            return {
              output: "Approval required. Type 'approve' to continue or 'reject' to cancel.",
            };
          } 
          resultText = await ttsTool(input.input);
          runtimeContext.setLastAgentOutput(resultText);  
          break;

        default:
          resultText = "Unknown tool requested by planner.";
      }
    }

    return { output: resultText };
  }
}

export const orchestrator = new Orchestrator();
