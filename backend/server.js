import express from 'express';
import cors from 'cors';
import offerRoutes from './routes/offerRoutes.js';

const app = express();
const PORT = process.env.PORT || 2323;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', offerRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log('API Endpoints:');
  console.log('  POST /api/offers - Create a new offer');
  console.log('  GET /api/offers - Get all active offers');
  console.log('  GET /api/offers?enable_smart_recommendations=true - Get offers with smart sorting');
});
