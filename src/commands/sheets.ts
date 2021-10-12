import {
  CommandInteraction,
  MessageActionRow,
  MessageButton,
  MessageEmbed
} from 'discord.js';
import {
  Discord,
  Slash,
  SlashOption
} from 'discordx';
import { sendPaginatedEmbeds } from '@discordx/utilities';
import map from 'lodash/map';
import BggManager from '../BggManager';
import SheetManager from '../SheetManager';
import { MessageButtonStyles } from 'discord.js/typings/enums';

@Discord()
export abstract class Sheets {
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
    const results = await BggManager.findGame(game);
    const gamesList = await Promise.all(map(results, async (game) => await BggManager.fillOutDetails(game)));
    
    const sheetManager = new SheetManager();
    await sheetManager.connect();

    console.log(gamesList);

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

      const addGameButton = new MessageActionRow().addComponents([
        new MessageButton({
          customId: `add-game-${currentGame.id}`,
          style: MessageButtonStyles.PRIMARY,
          label: 'Add Game',
          // action: async () => {
          //   await sheetManager.addGame([currentGame.name, currentGame.players(), owner, owner, currentGame.link()])
          // }
        })
      ]);

      return embed;
    });

    await sendPaginatedEmbeds(interaction, pages);

    // console.log(gamesList);
    // let selectedGame = gamesList[2];
    // selectedGame = await BggManager.fillOutDetails(selectedGame);
    // console.log(selectedGame);

    // const response = await sheetManager.addGameFromBgg(game);
    // await interaction.reply(response);
  }
}

export default Sheets;
