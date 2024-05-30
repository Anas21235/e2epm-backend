e2epm-backend/
  server.js
  models/
    process.js
  routes/
    processes.js
  package.json
{
  "name": "e2epm-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.17.1",
    "mongoose": "^5.10.9",
    "pg": "^8.5.1"
  }
}
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
  res.send('E2EPM Backend is running!');
});

const processesRouter = require('./routes/processes');
app.use('/processes', processesRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
const mongoose = require('mongoose');

const processSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  category: String,
  policy: String,
  business_rules: String,
  risk_level: Number,
  kpi: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

module.exports = mongoose.model('Process', processSchema);
const router = require('express').Router();
let Process = require('../models/process');

router.route('/').get((req, res) => {
  Process.find()
    .then(processes => res.json(processes))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const newProcess = new Process(req.body);

  newProcess.save()
    .then(() => res.json('Process added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
  Process.findById(req.params.id)
    .then(process => res.json(process))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
  Process.findByIdAndDelete(req.params.id)
    .then(() => res.json('Process deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
  Process.findById(req.params.id)
    .then(process => {
      Object.assign(process, req.body);
      process.save()
        .then(() => res.json('Process updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
