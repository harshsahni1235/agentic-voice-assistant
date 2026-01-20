export type OrchestratorInput = {
  input: string;
};


export type PlannerDecision = {
  intent: "explain" | "summarize" | "narrate";
  requiresApproval: boolean;
  tools: string[];
};

export type OrchestratorResult = {
  output: string;
};
