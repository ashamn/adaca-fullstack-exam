import express, { Application, Express, Request, Response } from "express";
import { getMessageReply } from "../controllers/messages";
import { getContextByValue } from "../services/database/context";
import Cache from "../services/cache";

const messageRouter = express.Router();
const cache = Cache();

// TODO: something is wrong with this line
messageRouter.post("/", async (req: Request, res: Response) => {
  // TODO: Validate input, return 400 if input is invalid
  const input = req.body;

  if (!input.conversation_id || !input.message) {
    res.status(400).send("No conversation_id or message");
    return;
  }

  const reply = await getMessageReply(
    {
      database: {
        // TODO: something is wrong with this line
        getContextByValue,
      },
      cache,
    },
    input
  );
  res.status(200).json(reply);
});

export const useMessageRouter = (app: Application) => {
  app.use("/v1/message", messageRouter);
};
