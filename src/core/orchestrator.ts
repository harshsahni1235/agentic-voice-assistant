import { inputGuardrailAgent } from "../agent/guardrail.agent";
import { plannerAgent } from "../agent/planner.agent";
import { explainTool } from "../tools/explain.tool";
import { summarizeTool } from "../tools/summarize.tool";
import { ttsTool } from "../tools/tts.tool";
import { OrchestratorInput, OrchestratorResult } from "./types";

class Orchestrator {
  async run(input: OrchestratorInput): Promise<OrchestratorResult> {
    const runtimeContext = input.context;

    console.log("Orchestrator received input:", input.input);

    // 🔁 HUMAN-IN-THE-LOOP RESUME
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

    // 1️⃣ INPUT GUARDRAIL
    const guardrail = await inputGuardrailAgent(input.input);

    if (!guardrail.allowed) {
      return {
        output: `Input rejected: ${guardrail.reason}`,
      };
    }

    // 2️⃣ PLANNER
    const decision = await plannerAgent(input.input);

    if (!decision.tools || decision.tools.length === 0) {
      return { output: "Planner error: no tools selected." };
    }

    let resultText = "";

    // 3️⃣ TOOL EXECUTION
    for (const tool of decision.tools) {
      switch (tool) {

        case "explain_tool":
          resultText = await explainTool(input.input, runtimeContext);
          runtimeContext.setLastAgentOutput(resultText);
          break;

        case "summarize_tool":
          resultText = await summarizeTool(input.input, runtimeContext);
          runtimeContext.setLastAgentOutput(resultText);
          break;

        case "tts_tool":
          const contentToNarrate =
            runtimeContext.getLastAgentOutput() ?? input.input;

          if (decision.requiresApproval) {
            runtimeContext.setPendingAction({
              tool: "tts_tool",
              content: contentToNarrate,
            });

            return {
              output: "__APPROVAL_REQUIRED__",
            };
          }

          resultText = await ttsTool(contentToNarrate);
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