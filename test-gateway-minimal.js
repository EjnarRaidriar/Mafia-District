const express = require('express');
const app = express();

// Simple test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Gateway is working!' });
});

// User token endpoint
app.post('/api/gateway/user-token', express.json(), (req, res) => {
  const { userId, username, role } = req.body;
  
  if (!userId || !username) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'userId and username are required'
    });
  }

  res.json({
    token: 'test-token-' + Date.now(),
    userId,
    username,
    role: role || 'user',
    expiresIn: '24h'
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Test Gateway listening on http://localhost:${PORT}`);
});
