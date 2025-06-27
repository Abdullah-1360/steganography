const tf = require('@tensorflow/tfjs-node'); // Ensure you are using tfjs-node for Node.js environment
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: '/tmp/' });

// Load the model
const modelPath = path.join(__dirname, 'model_js');
let model;

async function loadModel() {
  try {
    model = await tf.loadLayersModel(`file://${modelPath}/model.json`);
    console.log('Model loaded');
  } catch (error) {
    console.error('Error loading model:', error);
  }
}

loadModel();

app.post('/predict', upload.single('image'), async (req, res) => {
  if (!model) {
    return res.status(500).json({ error: 'Model not loaded' });
  }

  const imagePath = req.file.path;

  try {
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
  } catch (error) {
    console.error('Error during prediction:', error);
    res.status(500).json({ error: 'Prediction failed' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});