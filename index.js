import "dotenv/config";
import express from "express";
import cors from "cors";
import Groq from "groq-sdk";
import { checkEnvironment } from "./utils.js";

checkEnvironment();

const app = express();

const groq = new Groq({
  apiKey: process.env.AI_KEY,
});

const messages = [
  {
    role: "system",
    content: `You are the Gift Genie!
Make your gift suggestions thoughtful and practical.
Your response must be under 100 words.
Skip intros and conclusions.
Only output gift suggestions.`,
  },
];

app.use(cors());
app.use(express.json());

app.post("/api/gifts", async (req, res) => {
  try {
    const { prompt } = req.body;

    messages.push({
      role: "user",
      content: prompt,
    });

    const response = await groq.chat.completions.create({
      model: process.env.AI_MODEL,
      messages,
    });

    const aiResponse = response.choices[0].message.content;

    messages.push({
      role: "assistant",
      content: aiResponse,
    });

    res.json({
      success: true,
      response: aiResponse,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: "Failed to generate response",
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
