import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import { OrderRoutes } from './app/modules/order/order.route';
import { UserRoutes } from './app/modules/user/user.route';

const app: Application = express();

// Parser
app.use(express.json());
app.use(cors());

// App routes
app.use('/api/users', UserRoutes);
app.use('/api/users', OrderRoutes);

// Entry point
const initialController = (req: Request, res: Response) => {
  const message: string = 'Welcome to the API of Level 2 Assignment 2';
  res.send(message);
};

app.get('/', initialController);

export default app;
