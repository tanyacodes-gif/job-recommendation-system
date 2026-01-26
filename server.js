const express = require('express');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/recommend', (req, res) => {
  const { skills } = req.body;
  if (!skills || skills.length === 0) {
    return res.status(400).json({ error: 'No skills provided' });
  }
  const exeName = process.platform === 'win32' ? 'recommend.exe' : './recommend';
  const recommendProcess = spawn(exeName, skills);
  let output = '';
  let errorOutput = '';

  recommendProcess.stdout.on('data', (data) => {
    output += data.toString();
  });
  recommendProcess.stderr.on('data', (data) => {
    errorOutput += data.toString();
  });
  recommendProcess.on('close', (code) => {
    if (errorOutput) {
      console.error('C++ Error:', errorOutput);
    }
    try {
      const parsed = JSON.parse(output.trim());
      res.json({ recommendations: parsed });
    } catch (err) {
      console.error('JSON Parse Error:', err);
      console.error('Raw output:', output);
      res.status(500).json({ error: 'Failed to parse recommendation output' });
    }
  });
});
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});