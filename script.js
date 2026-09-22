import { autoResizeTextarea, setLoading } from "./utils.js";

const giftForm = document.getElementById("gift-form");
const userInput = document.getElementById("user-input");
const outputContent = document.getElementById("output-content");
const outputContainer = document.getElementById("output-container");

function start() {
  userInput.addEventListener("input", () => autoResizeTextarea(userInput));

  giftForm.addEventListener("submit", handleGiftRequest);
}

async function handleGiftRequest(e) {
  e.preventDefault();

  const userPrompt = userInput.value.trim();

  if (!userPrompt) return;

  setLoading(true);

  try {
    const response = await fetch("http://localhost:3000/api/gifts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: userPrompt,
      }),
    });

    const data = await response.json();

    outputContainer.classList.remove("hidden");

    outputContent.textContent = data.response;
  } catch (error) {
    console.error(error);

    outputContent.textContent = "Something went wrong.";
  } finally {
    setLoading(false);
  }
}

start();
