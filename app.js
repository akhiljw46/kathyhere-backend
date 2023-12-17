const express = require('express');
require('dotenv').config({ path: './config.env' });

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require('@google/generative-ai');

const { kathy, tom } = require('./initialParts');

// Server settings
const app = express();
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(express.json());

//Gemini settings

const MODEL_NAME = 'gemini-pro';
const API_KEY = process.env.API_KEY;

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

async function run(history) {
  const parts = [...tom, history, { text: 'output: ' }];

  const result = await model.generateContent({
    contents: [{ role: 'user', parts }],
    generationConfig,
    safetySettings,
  });

  const response = result.response;
  //   console.log(response.text());
  return response.text();
}

const messageResponse = async (req, res, next) => {
  const inputMessages = req.body.messages;
  const parsedMessages = [];

  inputMessages.forEach(message => {
    parsedMessages.push({
      text: `${message.isUser ? 'input' : 'output'}: ${message.messageText} `,
    });
  });

  const outputMessage = await run(parsedMessages).catch(err =>
    res.status(200).json({
      status: 'success',
      message: 'Please ask me that again!',
    })
  );

  res.status(200).json({
    status: 'success',
    message: outputMessage,
  });

  //   console.log(parsedMessages);
};

const port = process.env.PORT || 3000;

app.get('', (req, res) => res.status(200).json({ status: 'success' }));
app.post('/v1/message/', messageResponse);
app.listen(port, () => console.log(`App running on port ${port}`));
