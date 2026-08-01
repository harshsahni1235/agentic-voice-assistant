export type OrchestratorInput = {
  input: string;
  context: any; // simplified for now
};


export type PlannerDecision = {
  intent: "explain" | "summarize" | "narrate";
  requiresApproval: boolean;
  tools: string[];
};

export type OrchestratorResult = {
  output: string;
};
