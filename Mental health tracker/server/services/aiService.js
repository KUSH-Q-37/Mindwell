const OpenAI = require("openai");

let openai = null;
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // Minimum 1 second between requests

const initializeOpenAI = () => {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.error("API key is missing");
      return false;
    }

    openai = new OpenAI({
      apiKey,
      maxRetries: 3,
      timeout: 30000,
    });
    return true;
  } catch (error) {
    console.error("Failed to initialize AI client:", error);
    return false;
  }
};

const validateApiKey = async () => {
  if (!openai) {
    if (!initializeOpenAI()) {
      return false;
    }
  }

  try {
    const response = await openai.chat.completions.create({
      messages: [{ role: "user", content: "test" }],
      model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
      max_tokens: 1,
    });

    if (response) {
      console.log("AI service initialized successfully");
      return true;
    }
  } catch (error) {
    if (error.status === 429) {
      console.error("API quota exceeded. Please check your billing details.");
    } else {
      console.error("AI service initialization failed:", error.message);
    }
    return false;
  }
};

// Export validation function for use during server startup
exports.validateApiKey = validateApiKey;

const fallbackResponses = [
  "I'm here to listen and support you. Would you like to tell me more about how you're feeling?",
  "That sounds challenging. Have you considered talking to a mental health professional about this?",
  "I understand this might be difficult. Remember to take care of yourself and practice self-compassion.",
  "Let's focus on what you can control. Would you like to explore some coping strategies?",
  "Thank you for sharing that with me. How can I best support you right now?",
];

const checkRequestThrottle = () => {
  const now = Date.now();
  if (now - lastRequestTime < MIN_REQUEST_INTERVAL) {
    return new Promise((resolve) =>
      setTimeout(resolve, MIN_REQUEST_INTERVAL - (now - lastRequestTime))
    );
  }
  lastRequestTime = now;
  return Promise.resolve();
};

const Resource = require("../models/Resource");
const Mood = require("../models/Mood");

exports.generateResponse = async (message, userId) => {
  if (!openai && !initializeOpenAI()) {
    return getFallbackResponse();
  }

  try {
    await checkRequestThrottle();

    // --- RAG: Retrieval Layer ---
    let contextStr = "";
    try {
      if (userId) {
        const recentMoods = await Mood.find({ user: userId }).sort({ date: -1 }).limit(3);
        if (recentMoods && recentMoods.length > 0) {
          const moodHistoryStr = recentMoods.map(m => `Mood: ${m.mood}/10, Anxiety: ${m.anxiety}, Sleep: ${m.sleepHours}h, Factors: ${m.factors?.map(f => f.factor).join(', ')}`).join(' | ');
          contextStr += `\n\nUser Context History (Last 3 logs):\n${moodHistoryStr}\nCRITICAL INSTRUCTION: Use this context to deeply personalize your response and be empathetic to their recent states. Do not explicitly say "I looked at your data." Allow it to feel like you just natively remember them.`;
        }
      }

      const keywords = message.split(' ').filter(w => w.length > 3).slice(0, 5);
      const searchRegex = new RegExp(keywords.join('|'), 'i');
      
      const resources = await Resource.find({
        $or: [
          { title: searchRegex },
          { category: searchRegex },
          { description: searchRegex }
        ]
      }).limit(2);

      if (resources && resources.length > 0) {
        contextStr = "\n\nUse the following verified professional resources to inform your response if relevant:\n" + 
          resources.map(r => `- ${r.title} (${r.category}): ${r.description}`).join('\n');
      }
    } catch (ragErr) {
      console.error("RAG Retrieval failed:", ragErr.message);
      // Continue without context if retrieval fails
    }

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a compassionate mental health support assistant. Provide empathetic, non-judgmental responses. " +
            "Never give medical advice. Encourage professional help when appropriate. " +
            "If provided below, refer to specific verified resources in a natural way." + 
            contextStr,
        },
        {
          role: "user",
          content: message,
        },
      ],
      max_tokens: 250,
      temperature: 0.7,
    });

    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error("AI Service Error:", error.message);

    if (error.status === 429) {
      if (error.code === "insufficient_quota") {
        console.log("Quota exceeded - switching to fallback responses");
      } else {
        console.log("Rate limit reached - implementing cooldown");
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    return getFallbackResponse();
  }
};

const getFallbackResponse = () => {
  const randomIndex = Math.floor(Math.random() * fallbackResponses.length);
  const response = fallbackResponses[randomIndex];
  console.log("Using fallback response due to API limitations");
  return response;
};

// Add more specific fallback responses
fallbackResponses.push(
  "I'm experiencing some technical limitations right now, but I'm still here to listen. How can I support you?",
  "While I gather my thoughts, could you tell me more about what's on your mind?",
  "I want to make sure I give you the best support. Could you elaborate on that?"
);
