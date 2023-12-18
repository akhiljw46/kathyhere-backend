const express = require('express');
require('dotenv').config({ path: './config.env' });
const { messageResponse } = require('./controller');

// Server settings
const app = express();
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(express.json());

app.get('', (req, res) => res.status(200).json({ status: 'success' }));
app.post('/v1/message/:user', messageResponse);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App running on port ${port}`));
