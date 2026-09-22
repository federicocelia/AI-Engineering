import "dotenv/config";
import Groq from "groq-sdk";
import { checkEnvironment } from "./utils.js";

checkEnvironment();

const groq = new Groq({
  apiKey: process.env.AI_KEY,
});

const messageHistory = [];

async function sendMessage(userInput) {
  try {
    // Add user message to history
    messageHistory.push({
      role: "user",
      content: userInput,
    });

    // Send entire conversation history
    const response = await groq.chat.completions.create({
      model: process.env.AI_MODEL,
      messages: messageHistory,
    });

    const aiReply = response.choices[0].message.content;

    // Add AI response to history
    messageHistory.push({
      role: "assistant",
      content: aiReply,
    });

    return aiReply;
  } catch (error) {
    if (error.status === 401 || error.status === 403) {
      console.error("Authentication error: Check your API key.");
    } else if (error.status >= 500) {
      console.error("Provider error: Try again later.");
    } else {
      console.error("Unexpected error:", error.message || error);
    }

    return null;
  }
}

// First prompt
const firstReply = await sendMessage(
  "Suggest some gifts for someone who loves hiphop music. in 150 words",
);

// console.log("\nAssistant:");
// console.log(firstReply);

// Follow-up prompt
const secondReply = await sendMessage(
  "Can you make those gift ideas under $50? 150 words",
);

// console.log("\nAssistant:");
// console.log(secondReply);

// Another follow-up
const thirdReply = await sendMessage(
  "Which three would be best for a teenager? 150 words",
);

// console.log("\nAssistant:");
// console.log(thirdReply);

// View entire conversation history
console.log("Conversation History:");
console.log(JSON.stringify(messageHistory, null, 2));
