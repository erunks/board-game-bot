import 'reflect-metadata';
import path from 'path';
import { Client } from 'discordx';
import {
  Intents,
  Interaction,
  Message
} from 'discord.js';
import split from 'lodash/split';

export class DiscordBot {
  private static _client: Client;

  static get Client(): Client {
    return this._client;
  }

  static async start(): Promise<void> {
    this._client = new Client({
      classes: [
        path.join(__dirname, 'commands', '**/*.{ts,js}'),
        path.join(__dirname, 'events', '**/*.{ts,js}'),
      ],
      intents: [
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MESSAGES,
      ],
      botGuilds: [(client) => client.guilds.cache.map((guild) => guild.id), ...split(process.env.GUILD_IDS, ',')],
      silent: false,
    });

    this._client.once('ready', async () => {
      await this._client.initApplicationCommands({
        guild: { log: true },
        global: { log: true },
      });
      await this._client.initApplicationPermissions();

      console.log('Bot started');
    });

    this._client.on('interactionCreate', (interaction: Interaction) => {
      this._client.executeInteraction(interaction);
    });

    this._client.on('messageCreate', (message: Message) => {
      this._client.executeCommand(message);
    });

    await this._client.login(process.env.DISCORD_BOT_TOKEN);
  }
}

DiscordBot.start();
