import readline from "readline";
import { orchestrator } from "./core/orchestrator";
import express from "express";

const app = express();
app.use(express.json());

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

app.post("/run", async (req, res) => {
  const { input } = req.body;

  const result = await orchestrator.run({ input });
  res.json(result);
});

app.listen(3000, "0.0.0.0", () => {
  console.log("Server running on port 3000");
});

async function ask() {
  rl.question("> ", async (userInput) => {
    const result = await orchestrator.run({ input: userInput });
    console.log("question", result.output);

    ask(); // 🔁 keep listening
  });
}

console.log("Agentic Voice Assistant started. Type your message:");
ask();

