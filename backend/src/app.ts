import express, { Application, Express, Request, Response } from "express";
import { useMessageRouter } from "./routes/messages";

const app: Application = express();

app.use(express.json());
useMessageRouter(app);
// TODO: missing something here

export default app;
