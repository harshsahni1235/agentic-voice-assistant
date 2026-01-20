export type GuardrailResult = {
  allowed: boolean;
  reason?: string;
};

export async function inputGuardrailAgent(
    input: string
): Promise<GuardrailResult> {

    if (!input || input.trim().length === 0) {
        return {
        allowed: false,
        reason: "Input cannot be empty",
        };
    }
    if (input.length > 2000) {
        return {
        allowed: false,
        reason: "Input is too long",
        };
    }

    // very basic safety check (we'll improve later)
    const blockedWords = ["password", "credit card", "ssn"];
    const lower = input.toLowerCase();

    if (blockedWords.some((word) => lower.includes(word))) {
        return {
        allowed: false,
        reason: "Sensitive content detected",
        };
    }

    return { allowed: true, reason: "Input is safe" };

}