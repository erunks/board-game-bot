import {
  Discord,
  Description,
  Slash
} from '@typeit/discord';
import { CommandInteraction } from 'discord.js';
// import get from 'lodash/get';
// import join from 'lodash/join';
// import map from 'lodash/map';
// import sortBy from 'lodash/sortBy';

@Discord()
@Description('Basic Commands list')
export abstract class BasicCommands {
  @Slash('ping')
  @Description('Responds with `pong!`')
  ping(interaction: CommandInteraction): void {
    interaction.reply('pong!');
  }

  // @Slash('commands')
  // @Description('Get the available list of commands')
  // commands(command: CommandMessage): void {
  //   const commandList = map(
  //     sortBy(Client.getCommands(), (o) => o.commandName),
  //     (command) => {
  //       const name = get(command, 'commandName');
  //       const description = get(command, 'description', 'No description available.');

  //       return `> ${name} - ${description}`;
  //     }
  //   );

  //   command.reply(
  //     "Here is a list of commands:\n" + join(commandList, '\n')
  //   );
  // }
}

export default BasicCommands;
