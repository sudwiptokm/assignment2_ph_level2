import cors from "cors";
import express, { Application, Request, Response } from "express";

const app: Application = express();

// Parser
app.use(express.json());
app.use(cors());

// App routes

// Entry point
const initialController = (req: Request, res: Response) => {
  const message: string = "Welcome to the API of Level 2 Assignment 2";
  res.send(message);
};

app.get("/", initialController);

export default app;
