const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require('@google/generative-ai');

const { kathy } = require('./models/kathy');
const { tom } = require('./models/tom');
const { logger } = require('./utils');

const MODEL_NAME = 'gemini-pro';
const API_KEY = process.env.API_KEY;

async function runChat(user, chatHistory, userInput) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ];

  const userModel = user === 'kathy' ? kathy : tom;

  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [...userModel, ...chatHistory],
  });

  const result = await chat.sendMessage(userInput);
  const response = result.response;
  return response.text();
}

exports.messageResponse = async (req, res) => {
  try {
    const inputMessages = req.body.messages;
    const parsedMessages = [];

    inputMessages.forEach((message, i) => {
      // Add the messages except the last user input
      if (i < inputMessages.length - 1)
        parsedMessages.push({
          role: message.isUser ? 'user' : 'model',
          parts: [{ text: message.messageText }],
        });
    });

    const userInput = inputMessages.at(-1).messageText;

    const outputMessage = await runChat(
      req.params.user,
      parsedMessages,
      userInput
    );

    res.status(200).json({
      status: 'success',
      message: outputMessage,
    });

    //logging
    await logger({ user: userInput, model: outputMessage });
  } catch (error) {
    console.error(error);
    res.status(200).json({
      status: 'failed',
      message: 'Please ask me that again!',
    });
  }
};
