import {
  Discord,
  Client,
  CommandMessage,
  Command,
  Description,
  Guard,
} from '@typeit/discord';
import get from 'lodash/get';
import join from 'lodash/join';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';
import { NotBot } from '../guards';

@Discord('/')
@Description('Basic Commands list')
export abstract class BasicCommands {
  @Command('ping')
  @Description('Responds with `pong!`')
  @Guard(NotBot)
  ping(command: CommandMessage): void {
    command.reply('pong!');
  }

  @Command('commands')
  @Description('Get the available list of commands')
  commands(command: CommandMessage): void {
    const commandList = map(
      sortBy(Client.getCommands(), (o) => o.commandName),
      (command) => {
        const name = get(command, 'commandName');
        const description = get(command, 'description', 'No description available.');

        return `> ${name} - ${description}`;
      }
    );

    command.reply(
      "Here is a list of commands:\n" + join(commandList, '\n')
    );
  }
}

export default BasicCommands;
