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

app.use(cors());
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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});