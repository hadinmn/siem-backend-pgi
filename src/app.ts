import express from 'express';
import dotenv from 'dotenv';
import healthRouter from './routes/health.routes';
import alertRouter from './routes/alert.routes';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/health', healthRouter);
app.use('/alerts', alertRouter);

export default app;