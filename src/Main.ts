import { Client } from '@typeit/discord';
import { config } from 'dotenv';

export class Main {
  private static _client: Client;

  static get Client(): Client {
    return this._client;
  }

  static async start(): Promise<void> {
    this._client = new Client();

    await this._client.login(
      process.env.DISCORD_BOT_TOKEN,
      `${__dirname}/*.ts`,
      `${__dirname}/*.js`,
    );
  }
}

config();
Main.start();
