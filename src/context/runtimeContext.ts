type PendingAction = {
  tool: string;
  content: string;
//   input: string;
};


class RuntimeContext {
    private pendingAction : PendingAction | null = null;
    private lastAgentOutput: string | null = null;

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
}

export const runtimeContext = new RuntimeContext();