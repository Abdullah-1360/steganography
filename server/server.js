require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

const app = express();

// Middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(bodyParser.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*'
}));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

// Schema and Model
const StegoSchema = new mongoose.Schema({
  password: String,
  encodedText: String,
  createdAt: { type: Date, default: Date.now }
});

const StegoData = mongoose.model('StegoData', StegoSchema);

// Routes with Input Validation
app.post('/store', async (req, res) => {
  const { password, encodedText } = req.body;

  if (!password || !encodedText) {
    return res.status(400).send('Missing required fields');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const stegoData = new StegoData({ password: hashedPassword, encodedText });
    await stegoData.save();
    res.status(201).send({ id: stegoData._id });
  } catch (error) {
    console.error('Error storing data:', error);
    res.status(500).send('Internal server error');
  }
});

app.post('/retrieve', async (req, res) => {
  const { id, password } = req.body;

  if (!id || !password) {
    return res.status(400).send('Missing required fields');
  }

  try {
    const stegoData = await StegoData.findById(id);
    if (!stegoData) {
      return res.status(404).send('Data not found');
    }

    const isMatch = await bcrypt.compare(password, stegoData.password);
    if (!isMatch) {
      return res.status(401).send('Incorrect password');
    }

    res.status(200).send({ encodedText: stegoData.encodedText });
  } catch (error) {
    console.error('Error retrieving data:', error);
    res.status(500).send('Internal server error');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});