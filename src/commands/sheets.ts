import {
  ButtonInteraction,
  CommandInteraction,
  MessageActionRow,
  MessageButton,
  MessageEmbed
} from 'discord.js';
import {
  ButtonComponent,
  Client,
  Discord,
  Slash,
  SlashOption
} from 'discordx';
import { sendPaginatedEmbeds } from '@discordx/utilities';
import map from 'lodash/map';
import BggManager, { BggGame } from '../BggManager';
import SheetManager from '../SheetManager';
import { MessageButtonStyles } from 'discord.js/typings/enums';

class OptionWrapper {
  constructor(
    public game: BggGame,
    public owner: string,
    public location: string,
    public interaction: CommandInteraction
  ) {
    return;
  }
}

@Discord()
export abstract class Sheets {
  private static  _optionsArguments: Map<string, OptionWrapper> = new Map();
  
  static get optionsArguments(): Map<string, OptionWrapper> {
    return this._optionsArguments;
  }
  
  @Slash('document', { description: 'Responds with a link to `The Library` sheet.'})
  async getDocument(interaction: CommandInteraction): Promise<void> {
    interaction.reply(`https://docs.google.com/spreadsheets/d/${process.env.GOOGLE_SHEET_ID}/`);
  }

  @Slash('addgame', { description: 'Adds a game to the sheet.' })
  async addGame(
    @SlashOption('game', { required: true }) game: string,
    @SlashOption('players', { required: true }) players: string,
    @SlashOption('owner', { required: true }) owner: string,
    @SlashOption('location', { description: 'Assumed to be owner', required: false }) location: string,
    @SlashOption('bgglink', { required: false }) bggLink: string,
    interaction: CommandInteraction
  ): Promise<void> {
    const sheetManager = new SheetManager();
    await sheetManager.connect();
    const response = await sheetManager.addGame([game, players, owner, location ?? owner, bggLink ?? '']);
    await interaction.reply(response);
  }

  @Slash('addgamefrombgg', { description: 'Finds and adds a game into the sheet.' })
  async addGameFromBgg(
    @SlashOption('game', { required: true }) game: string,
    @SlashOption('owner', { required: true }) owner: string,
    @SlashOption('location', { description: 'Assumed to be owner', required: false }) location: string,
    interaction: CommandInteraction
  ): Promise<void> {
    await interaction.deferReply();

    const results = await BggManager.findGame(game);
    const gamesList = await Promise.all(map(results, async (game) => await BggManager.fillOutDetails(game)));

    const pages = map(gamesList, (currentGame, i) => {
      const embed = new MessageEmbed()
        .setFooter(`Game ${i + 1} of ${gamesList.length}`)
        .setTitle(currentGame.name)
        .setThumbnail(currentGame.thumbnail)
        .addField('Game Type', currentGame.gameType(), true)
        .addField('Players', currentGame.players(), true);

      if (currentGame.yearPublished) {
        embed.addField('Year Published', currentGame.yearPublished, false);
      }

      embed.addField('BGG Link', currentGame.link(), false);

      const customId = `add-game-${currentGame.id}`;
      const addGameButton = new MessageActionRow().addComponents([
        new MessageButton({
          customId,
          style: MessageButtonStyles.PRIMARY,
          label: `Add: ${currentGame.name}`,
        })
      ]);

      Sheets._optionsArguments.set(customId, new OptionWrapper(currentGame, owner, location, interaction));

      return { embeds: [embed], components: [addGameButton] };
    });

    await sendPaginatedEmbeds(interaction, pages);
  }
}

export default Sheets;
