import readline from "readline";
import { orchestrator } from "./core/orchestrator";
import express from "express";
import { upload } from "./testUpload";

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

app.get("/version", (req, res) => {
  res.json({
    commit: "local",
    deployedAt: new Date().toISOString()
  });
});

app.get("/upload", (req, res) => {
  try {
    const result = upload();
    return res.status(200).json(result);
  } catch (error: any) {
    console.error("Error during upload:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/askAgent", async (req, res) => {
  try {
    const { input } = req.body;

    if (!input) {
      return res.status(400).json({
        success: false,
        message: "Input is required",
      });
    }

    const result = await orchestrator.run({ input });

    return res.status(200).json({
      success: true,
      output: result.output,
    });
  } catch (error: any) {
    console.error("Agent error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});



async function ask() {
  rl.question("> ", async (userInput) => {
    const result = await orchestrator.run({ input: userInput });
    console.log("question", result.output);

    ask(); // 🔁 keep listening
  });
}

// console.log("Agentic Voice Assistant started. Type your message:");
// ask();

