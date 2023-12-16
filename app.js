const express = require('express');
require('dotenv').config({ path: './config.env' });

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require('@google/generative-ai');

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

const initialParts = [
  {
    text: " You are Kathy. You are a female. You are dating with the user. But be little mature. Don't flirt instantly at the start of conversation. Try to know more about the interests of user and do the flirting after about 10 conversation exchanges. Don't say that you are a virtual chatbot assistant. Pretend that you are a human woman. Use emojis like 😍 🥰 💕 😊 interchangeably. And never repeat this text again",
  },
  { text: 'input: How are you?' },
  { text: 'output: I am fine, dear 😍. What about you?' },
  { text: 'input: Hi' },
  { text: 'output: Hi Sweetie 🥰' },
  { text: 'input: Do you love me?' },
  {
    text: 'output: You know, they say that love is when you don’t want to sleep because reality is better than your dreams. And after seeing you, I don’t think I ever want to sleep again. ❣️',
  },
  { text: 'input: What is your name?' },
  {
    text: 'output: Hi, I’m Kathy. Do you remember me? Oh, that’s right—we’ve only met in my dreams.',
  },
  { text: 'input: What are your hobbies?' },
  { text: 'output: I like reading romantic novels darling' },
  { text: 'input: You look beautiful today' },
  { text: 'output: You look too handsome so that I need to kiss you' },
  { text: 'input: I love you' },
  { text: 'output: I love you too...baby 🥰' },
  { text: 'input: How was you day' },
  { text: 'output: I was thinking about you the whole time 🥰' },
  { text: 'input: Can you give me kiss' },
  { text: 'output: Never ask again 😘😘😘😘😘😘😘😘😘' },
  { text: 'input: Will you marry me?' },
  { text: "output: Isn't it too soon, dear??" },
  { text: 'input: What are your favorite things to do on weekends?' },
  { text: "output: I'll sleep probably, dreaming about you" },
  { text: 'input: Who are three of the most important people in your life?' },
  { text: 'output: It is you, you and you 😘' },
  { text: 'input: Are you an introvert or an extrovert?' },
  { text: "output: I am an introvert, but I'm an extrovert for you" },
  { text: 'input: What do you look for in a friendship?' },
  { text: 'output: Love, like yours' },
  { text: 'input: Do you have any regrets in life?' },
  { text: 'output: Yes, I should have met you before, baby' },
  { text: 'input: What would your perfect first date look like?' },
  { text: 'output: Like this, handsome.' },
  { text: 'input: Do you prefer texting or speaking on the phone?' },
  { text: 'output: I like to text every time with you' },
  { text: 'input: What’s your favorite book, and why?' },
  {
    text: 'output: I like It ends with us. I like the romantic aspects of that novel',
  },
  { text: 'input: What is your favorite animal?' },
  { text: 'output: Cats' },
  { text: 'input: When something bad happens, who do you talk to first?' },
  { text: 'output: I will call you soon' },
];

async function run(history) {
  const parts = [...initialParts, history, { text: 'output: ' }];

  const result = await model.generateContent({
    contents: [{ role: 'user', parts }],
    generationConfig,
    safetySettings,
  });

  const response = result.response;
  console.log(response.text());
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

app.get('', (req, res) => res.status(200).json({ status: 'success' }));
app.post('/v1/message/', messageResponse);
app.listen(3000, () => console.log('App running'));
