import { ButtonInteraction, CommandInteraction } from 'discord.js';
import { Discord, On, ArgsOf } from 'discordx';
import startsWith from 'lodash/startsWith';
import SheetManager from '../SheetManager';
import Sheets from '../commands/sheets';

@Discord()
export abstract class SheetEvents {
  @On('interactionCreate')
  async interactionCreated([receivedInteraction]: ArgsOf<'interactionCreate'>): Promise<void> {
    if (receivedInteraction.isButton()) {
      const buttonInteraction = receivedInteraction as ButtonInteraction;
      const customId = buttonInteraction.customId;

      if(!startsWith(customId, 'add-game-')) return;
      
      const { 
        game, 
        interaction,
        location, 
        owner, 
      } = Sheets.optionsArguments.get(customId);
      const commandInteraction = interaction as CommandInteraction;

      const sheetManager = new SheetManager();
      await sheetManager.connect();
      const response = await sheetManager.addGame([game.name, game.players(), owner, location ?? owner, game.link()]);
      await buttonInteraction.reply(response);
      await commandInteraction.deleteReply();
    }
  }
}

export default SheetEvents;
