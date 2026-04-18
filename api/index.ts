import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import profileRoutes from '../src/routes/profile.routes';
import { errorHandler } from '../src/middleware/error.middleware';

dotenv.config();

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/api/profiles', profileRoutes);

app.use(errorHandler);

export default app;