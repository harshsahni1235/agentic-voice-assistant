import "dotenv/config";
import readline from "readline";
import { orchestrator } from "./core/orchestrator";
import express from "express";
import { upload } from "./testUpload";
import { getSessionContext } from "./context/runtimeContext";
import http from "http";
import { WebSocketServer } from "ws";

const app = express();
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("Client connected");

  wss.on("connection", (ws) => {
    ws.on("message", async (message) => {
      try {
        const parsed = JSON.parse(message.toString());
        const { type, input, sessionId } = parsed;

        const sid = sessionId || "default-session";
        const context = getSessionContext(sid);

        // Inject stream writer
        context.setStreamWriter((chunk: string) => {
          ws.send(JSON.stringify({ type: "stream", data: chunk }));
        });

        // 🟢 Handle approval messages
        if (type === "approve" || type === "reject") {
          const result = await orchestrator.run({
            input: type,
            context,
          });

          ws.send(JSON.stringify({ type: "done", output: result.output }));
          return;
        }

        // 🟢 Normal user message
        if (type === "user_input") {
          const result = await orchestrator.run({
            input,
            context,
          });

          ws.send(JSON.stringify({ type: "done", output: result.output }));
        }

      } catch (err: any) {
        ws.send(JSON.stringify({ type: "error", message: err.message }));
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});


server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});


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
  const { input, context } = req.body;

  const result = await orchestrator.run({ input, context })
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

app.get("/upload", async(req, res) => {
  try {
    const result = await upload();
    return res.status(200).json(result);
  } catch (error: any) {
    console.error("Error during upload:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/askAgent", async (req, res) => {
  try {
    const { input, sessionId } = req.body;

    if (!input) {
      return res.status(400).json({
        success: false,
        message: "Input is required",
      });
    }

    const sid = sessionId || "default-session";

    const context = getSessionContext(sid);


    const result = await orchestrator.run({ input, context });

    return res.status(200).json({
      success: true,
      output: result.output,
      sessionId: sid,
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
    const result = await orchestrator.run({ input: userInput, context: null });
    console.log("question", result.output);

    ask(); // 🔁 keep listening
  });
}

// console.log("Agentic Voice Assistant started. Type your message:");
// ask();

