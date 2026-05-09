import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'PokeBox Backend is running' });
});

// API Routes
app.get('/api', (req, res) => {
  res.json({ message: 'PokeBox API v1' });
});

app.post('/api/payments/checkout', (req, res) => {
  res.json({ 
    sessionId: 'cs_test_placeholder',
    clientSecret: 'placeholder'
  });
});

app.get('/api/payments/session/:id', (req, res) => {
  res.json({ 
    sessionId: req.params.id,
    status: 'paid',
    amount: 999,
    metadata: {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ PokeBox Backend running on http://localhost:${PORT}`);
  console.log(`📚 Health check: http://localhost:${PORT}/health`);
});
