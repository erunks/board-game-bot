import { Discord, Slash } from 'discordx';
import { CommandInteraction } from 'discord.js';
// import get from 'lodash/get';
// import join from 'lodash/join';
// import map from 'lodash/map';
// import sortBy from 'lodash/sortBy';

@Discord()
export abstract class Base {
  @Slash('ping', { description: 'Ping the bot. Responds with `pong!`' })
  async ping(interaction: CommandInteraction): Promise<void> {
    await interaction.reply('pong!');
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

export default Base;
