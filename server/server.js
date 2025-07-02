// server.js
const tf = require('@tensorflow/tfjs-node');   // GPU/CPU bindings
const express = require('express');
const multer = require('multer');
const fs = require('fs').promises;             // Use async fs
const path = require('path');

const app = express();
const upload = multer({ dest: '/tmp/' });      // Temporary upload directory

// 1. Load model once at startup
const modelPath = path.join(__dirname, 'model_js');
let model;

async function loadModel() {
  console.log('Loading model...');
  model = await tf.loadLayersModel(`file://${modelPath}/model.json`);
  console.log('Model loaded successfully');
}

loadModel().catch(console.error);

// 2. Prediction endpoint
app.post('/predict', upload.single('image'), async (req, res) => {
  if (!model) return res.status(503).json({ error: 'Model not ready' });

  const imagePath = req.file.path;

  try {
    // 2.1 Read, resize, normalize
    const buffer = await fs.readFile(imagePath);
    const img = tf.node.decodeImage(buffer);
    const resized = tf.image.resizeBilinear(img, [256, 256]);
    const normalized = resized.div(255.0);
    const batched = normalized.expandDims(0);

    // 2.2 Predict
    const pred = model.predict(batched);
    const classId = pred.argMax(1).dataSync()[0];

    // 2.3 Clean up
    await fs.unlink(imagePath);
    tf.dispose([img, resized, normalized, batched, pred]); // Memory cleanup

    res.json({ predictedClass: Number(classId) });
  } catch (err) {
    console.error('Prediction error:', err);
    res.status(500).json({ error: 'Prediction failed' });
  }
});

// 3. Health check
app.get('/health', (_, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));