const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const generateRoute = require('./routes/generate');
const exportRoute = require('./routes/export');
const regenerateRoute = require('./routes/regenerate');
const imageRoute = require('./routes/image');
const outlineRoute = require('./routes/outline');
const assistantRoute = require('./routes/assistant');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Essential: Open CORS for Vercel and Local Network testing
app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/api/generate', generateRoute);
app.use('/api/export', exportRoute);
app.use('/api/regenerate', regenerateRoute);
app.use('/api/image', imageRoute);
app.use('/api/outline', outlineRoute);
app.use('/api/assistant', assistantRoute);

app.get('/', (req, res) => {
  res.json({ message: 'SlideAI Backend is running!' });
});

// Listening on 0.0.0.0 is required for your phone to find the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Local Access: http://localhost:${PORT}`);
  console.log(`Mobile Access: http://172.28.178.17:${PORT}`);
});