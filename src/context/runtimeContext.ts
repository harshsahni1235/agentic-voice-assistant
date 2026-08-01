type PendingAction = {
  tool: string;
  content: string;
//   input: string;
};


class RuntimeContext {
    private pendingAction : PendingAction | null = null;
    private lastAgentOutput: string | null = null;
    private streamWriter?: (chunk: string) => void;

    setLastAgentOutput(output: string) {
        this.lastAgentOutput = output;
    }

    getLastAgentOutput() {
        return this.lastAgentOutput;
    }


    setPendingAction(action: PendingAction){
        this.pendingAction = action
    }

    getPendingAction() {
        return this.pendingAction;
    }

    clearPendingAction(){
        this.pendingAction = null;
    }

    hasPendingAction(){
        return this.pendingAction !== null;
    }

    setStreamWriter(writer: (chunk: string) => void) {
        this.streamWriter = writer;
    }

    getStreamWriter() {
        return this.streamWriter;
    }
}

// 🧠 Context Manager
const sessions = new Map<string, RuntimeContext>();

export function getSessionContext(sessionId: string): RuntimeContext {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, new RuntimeContext());
  }

  return sessions.get(sessionId)!;
}

export const runtimeContext = new RuntimeContext();