import express from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import healthRouter from './routes/health.routes';
import alertRouter from './routes/alert.routes';
import dashboardRouter from './routes/dashboard.routes';
import highlightedIpRouter from './routes/highlighted-ip.routes';
import { errorHandler } from './middlewares/error.middleware';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/health', healthRouter);
app.use('/alerts', alertRouter);
app.use('/dashboard', dashboardRouter);
app.use('/highlighted-ips', highlightedIpRouter);

app.use(errorHandler);

export default app;