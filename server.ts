var cors = require("cors");
import express from "express";
import { SYSTEM_PROMPT } from "./prompt";
import { getGeminiResponse } from "./gemini";
const dotenv = require("dotenv");

dotenv.config();

type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Allow all origins
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Gemini chat endpoint
app.post("/api/chat", async (req, res: any) => {
  try {
    const { message, context = {} } = req.body;

    console.log("request", req.body);

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const messages: Message[] = [
      {
        role: "system",
        content: `${SYSTEM_PROMPT} Current webpage context: ${JSON.stringify(
          context
        )}`,
      },
      {
        role: "user",
        content: message,
      },
    ];

    console.log(messages);

    // Generate response
    const result = await getGeminiResponse(messages);

    res.json({ response: result });
  } catch (error) {
    console.error("Error in chat endpoint", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
