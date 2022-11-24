import { CONTEXT_MESSAGE } from "../constants/contextMessageMapping";
import { getContextByValue } from "../services/database/context";
import { CacheInstance } from "../services/cache";

export const getMessageReply = async (
  services: {
    database: { getContextByValue: typeof getContextByValue };
    cache: CacheInstance;
  },
  input: {
    conversation_id: string;
    message: string;
  }
) => {
  // TODO: Process the input and return a response based on the input's context
  // Note: All imports are already provided
  //
  // Example input.message "Hello World"
  // Example output.message "Welcome to Adaca."
  // reply_id should be equal to conversation_id
  //

  // Sample Workflow
  // 1. Check Cache, if cache exists, return data
  // 2. If no cache exists, start process again
  // 3. Check each words, use `services.database.getContextByValue` to detect context
  // 4. Map the context to message and send it as a reply, check `src/constants/contextMessageMapping.ts`

  const cached =
    Object.keys(services.cache.cache).length &&
    services.cache.get(input.message);

  if (cached) {
    return {
      reply_id: input.conversation_id,
      message: cached,
    };
  }

  const message = input.message;
  const messageArr = message.toLocaleLowerCase().split(" ");
  const contxt = await messageArr.reduce(async (acc, curr, indx) => {
    let acc2: string = await acc;
    if (!Object.keys(acc2).length) {
      const data = await services.database.getContextByValue(curr);
      if (data) acc2 = data || "";
      else if (messageArr && indx === messageArr.length - 1)
        acc2 = "NO_CONTEXT";
    }
    return acc2;
  }, Promise.resolve(""));

  const msg = CONTEXT_MESSAGE[contxt as keyof typeof CONTEXT_MESSAGE];
  services.cache.insert(input.message, msg);
  return {
    reply_id: input.conversation_id,
    message: msg,
  };
};
