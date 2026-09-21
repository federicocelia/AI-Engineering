import "dotenv/config";
import { checkEnvironment } from "./utils.js";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.AI_KEY,
});

checkEnvironment();
console.log("Environment loaded successfully");

const prompt = "Suggest some gifts for someone who loves hiphop music";

console.log("Prompt:", prompt);
console.log("Making AI request...");

try {
  const response = await groq.chat.completions.create({
    model: process.env.AI_MODEL,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  console.log("AI response:");
  console.log(response.choices[0].message.content);
} catch (error) {
  if (error.status === 401 || error.status === 403) {
    console.error(
      "Authentication error: Check your GROQ_API_KEY and make sure it's valid.",
    );
  } else if (error.status >= 500) {
    console.error(
      "Groq error: Something went wrong on the provider side. Try again shortly.",
    );
  } else {
    console.error("Unexpected error:", error.message || error);
  }
}
