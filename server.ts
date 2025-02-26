import express, { response } from "express";
import { SYSTEM_PROMPT } from "./prompt";
import { getGeminiResponse, Message } from "./gemini";
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware

app.use(express.json());

// Gemini chat endpoint
app.post("/api/chat", async (req: any, res: any) => {
  try {
    const { message, context = {} } = req.body;

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
