import { GuardFunction } from "@typeit/discord";

export const NotBot: GuardFunction<"message"> = async (
  [message],
  client,
  next
) => {
  if (client.user.id !== message.author.id && !message.author.bot) {
    await next();
  }
};
