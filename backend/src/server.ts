import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { paymentMiddleware } from 'x402-express';
import routes from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// x402 Payment Middleware Configuration
const facilitatorObj = { url: process.env.X402_FACILITATOR_URL || 'https://x402.org/facilitator' };
const network = process.env.X402_NETWORK || 'base-sepolia';

// Remove x402 middleware - we'll implement it manually per route
// This allows dynamic pricing and dynamic payment recipients

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ 
    message: 'Penny.io backend is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API routes
app.use('/api', routes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Penny.io backend server running on port ${PORT}`);
  console.log(`📚 API documentation available at http://localhost:${PORT}/api/health`);
});