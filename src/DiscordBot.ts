import * as Path from 'path';
import { Discord, CommandMessage, CommandNotFound } from '@typeit/discord';

@Discord('/', {
  import: [
    Path.join(__dirname, 'commands', '*.ts'),
    Path.join(__dirname, 'events', '*.ts'),
  ],
})
export abstract class DiscordBot {
  @CommandNotFound()
  notFound(command: CommandMessage): void {
    command.reply('Command not found');
  }
}

export default DiscordBot;
