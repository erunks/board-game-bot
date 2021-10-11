import 'reflect-metadata';
import { Client } from '@typeit/discord';
import { Intents } from 'discord.js';
// import split from 'lodash/split';

export class Main {
  private static _client: Client;

  static get Client(): Client {
    return this._client;
  }

  static async start(): Promise<void> {
    this._client = new Client({
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
      ],
      // slashGuilds: split(process.env.GUILD_IDS, ','),
      requiredByDefault: true,
    });

    await this._client.login(
      process.env.DISCORD_BOT_TOKEN,
      `${__dirname}/commands/*.ts`,
      `${__dirname}/events/*.ts`,
      `${__dirname}/commands/*.js`,
      `${__dirname}/events/*.js`,
    );

    this._client.once("ready", async () => {
      await this._client.clearSlashes();
      // await this._client.clearSlashes("693401527494377482");
      await this._client.initSlashes();

      console.log("Bot started");
    });

    this._client.on("interaction", (interaction) => {
      this._client.executeSlash(interaction);
    });
  }
}

Main.start();
