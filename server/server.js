require('dotenv').config();
const tf = require('@tensorflow/tfjs'); // instead of tfjs-node
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Load the model
const modelPath = path.join(__dirname, 'model_js');
let model;

async function loadModel() {
  model = await tf.loadLayersModel(`file://${modelPath}/model.json`);
  console.log('Model loaded');
}

loadModel();

app.post('/predict', upload.single('image'), async (req, res) => {
  const imagePath = req.file.path;

  // Load the image
  const img = tf.node.decodeImage(fs.readFileSync(imagePath));
  const resizedImg = tf.image.resizeBilinear(img, [256, 256]);
  const normalizedImg = resizedImg.div(tf.scalar(255.0));
  const batchedImg = normalizedImg.expandDims(0);

  // Make prediction
  const prediction = model.predict(batchedImg);
  const predictedClass = prediction.argMax(1).dataSync()[0];

  // Clean up
  fs.unlinkSync(imagePath);

  res.json({ predictedClass });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
