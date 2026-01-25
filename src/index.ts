import express from "express";
import { orchestrator } from "./core/orchestrator";

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.post("/run", async (req, res) => {
  const { input } = req.body;

  const result = await orchestrator.run({ input });
  res.json(result);
});

app.listen(3000, "0.0.0.0", () => {
  console.log("Server running on port 3000");
});
