const express = require('express');

const app = express();

app.use(express.json());

app.get('', (req, res) => res.status(200).json({ status: 'success' }));
app.listen(3000, () => console.log('App running'));
