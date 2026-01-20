import readline from "readline";
import { orchestrator } from "./core/orchestrator";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});


// async function main() {
//   const result = await orchestrator.run({
//     input: "Read this explanation aloud",
//   });

//   console.log("Final Result:", result);
//   console.log("Final Output:", result.output);
// }

// main();

async function ask() {
  rl.question("> ", async (userInput) => {
    const result = await orchestrator.run({ input: userInput });
    console.log("question", result.output);

    ask(); // 🔁 keep listening
  });
}

console.log("Agentic Voice Assistant started. Type your message:");
ask();
