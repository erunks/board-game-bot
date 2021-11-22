import {
  ButtonInteraction,
  CommandInteraction,
  Interaction,
  InteractionCollector,
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from 'discord.js';
import { MessageButtonStyles } from 'discord.js/typings/enums';
import { Discord, Slash, SlashOption } from 'discordx';
import max from 'lodash/max';
import min from 'lodash/min';
import slice from 'lodash/slice';
import truncate from 'lodash/truncate';
import BggManager from '../managers/BggManager';
import SheetManager from '../managers/SheetManager';
import BggGame from '../models/BggGame';
import GameFilter from '../models/GameFilter';
import SheetGame from '../models/SheetGame';

@Discord()
export abstract class Sheets {
  private static _interactionGames: Map<
    CommandInteraction,
    BggGame[] | SheetGame[]
  > = new Map();
  private static _interactionIndex: Map<CommandInteraction, number> = new Map();

  static get interactionGames(): Map<
    CommandInteraction,
    BggGame[] | SheetGame[]
  > {
    return this._interactionGames;
  }

  static get interactionIndex(): Map<CommandInteraction, number> {
    return this._interactionIndex;
  }

  @Slash('document', {
    description: 'Responds with a link to `The Library` sheet.',
  })
  async getDocument(interaction: CommandInteraction): Promise<void> {
    interaction.reply(
      `https://docs.google.com/spreadsheets/d/${process.env.GOOGLE_SHEET_ID}/`
    );
  }

  @Slash('addgame', { description: 'Adds a game to the sheet.' })
  async addGame(
    @SlashOption('game', { required: true }) game: string,
    @SlashOption('players', { required: true }) players: string,
    @SlashOption('owner', { required: true }) owner: string,
    @SlashOption('location', {
      description: 'Assumed to be owner',
      required: false,
    })
    location: string,
    @SlashOption('bgglink', { required: false }) bggLink: string,
    interaction: CommandInteraction
  ): Promise<void> {
    const sheetManager = new SheetManager();
    await sheetManager.connect();
    const response = await sheetManager.addGame([
      game,
      players,
      owner,
      location ?? owner,
      bggLink ?? '',
    ]);
    await interaction.reply(response);
  }

  @Slash('addgamefrombgg', {
    description: 'Finds and adds a game into the sheet.',
  })
  async addGameFromBgg(
    @SlashOption('game', { required: true }) game: string,
    @SlashOption('owner', { required: true }) owner: string,
    @SlashOption('location', {
      description: 'Assumed to be owner',
      required: false,
    })
    location: string,
    interaction: CommandInteraction
  ): Promise<void> {
    await interaction.deferReply();

    const results = await BggManager.findGame(game);
    let gamesList: BggGame[];

    if (results.length === 0) {
      await interaction.followUp(
        `${interaction.member} No results found for: \`${game}\``
      );
      return null;
    } else if (results.length === 1) {
      gamesList = [await BggManager.fillOutDetails(results[0])];
    } else {
      gamesList = [
        await BggManager.fillOutDetails(results[0]),
        ...slice(results, 1),
      ];
    }

    this.setSheetInteractionGames(gamesList, interaction);

    const { collector } = await this.createGameInteraction(
      interaction,
      gamesList,
      [this.getActionRow(interaction)]
    );

    collector.on('collect', async (collectInteraction: ButtonInteraction) => {
      await collectInteraction.deferUpdate();

      if (interaction.user.id !== collectInteraction.user.id) {
        await interaction.followUp(
          `${collectInteraction.member}, since you did not initiate this command, you cannot use it.`
        );
        return null;
      }

      const buttonId = collectInteraction.customId;

      switch (buttonId) {
        case 'previous-game':
          this.decrementSheetInteractionIndex(interaction);
          break;
        case 'next-game':
          this.incrementSheetInteractionIndex(interaction);
          const nextGame = this.getCurrentGame(interaction);
          if (!nextGame.loaded) await BggManager.fillOutDetails(nextGame);
          break;
        case 'add-game':
          await this.addCurrentGame(interaction, owner, location ?? owner);
          break;
      }

      await collectInteraction.editReply({
        embeds: [this.getGameEmbed(interaction, gamesList.length)],
        components: [this.getActionRow(interaction)],
      });
      return null;
    });

    return null;
  }

  @Slash('viewgames', {
    description:
      'Lists all games in the sheet, with optional filtering by field.',
  })
  async getGames(
    @SlashOption('name', { required: false, description: 'Filters' })
    name: string,
    @SlashOption('playercount', {
      required: false,
      description:
        'Filter can be a range (e.g. 1-4) or a single number (e.g. 5)',
    })
    playerCount: string,
    @SlashOption('location', { required: false }) location: string,
    @SlashOption('owner', { required: false }) owner: string,
    interaction: CommandInteraction
  ): Promise<void> {
    await interaction.deferReply();
    const sheetManager = new SheetManager();
    await sheetManager.connect();
    const games: SheetGame[] = await sheetManager.getGames(
      new GameFilter({ name, playerCount, location, owner })
    );

    this.setSheetInteractionGames(games, interaction);

    const { collector } = await this.createGameInteraction(interaction, games, [
      new MessageActionRow().addComponents(
        this.getPreviousButton(interaction),
        this.getNextButton(interaction)
      ),
    ]);

    collector.on('collect', async (collectInteraction: ButtonInteraction) => {
      await collectInteraction.deferUpdate();

      if (interaction.user.id !== collectInteraction.user.id) {
        await interaction.followUp(
          `${collectInteraction.member}, since you did not initiate this command, you cannot use it.`
        );
        return null;
      }

      const buttonId = collectInteraction.customId;

      switch (buttonId) {
        case 'previous-game':
          this.decrementSheetInteractionIndex(interaction);
          break;
        case 'next-game':
          this.incrementSheetInteractionIndex(interaction);
          break;
      }

      await collectInteraction.editReply({
        embeds: [this.getGameEmbed(interaction, games.length)],
        components: [
          new MessageActionRow().addComponents(
            this.getPreviousButton(interaction),
            this.getNextButton(interaction)
          ),
        ],
      });
      return null;
    });

    return null;
  }

  private async addCurrentGame(
    interaction: CommandInteraction,
    owner: string,
    location: string
  ): Promise<void> {
    const currentGame = this.getCurrentGame(interaction);
    const sheetManager = new SheetManager();
    await sheetManager.connect();
    const response = await sheetManager.addGame([
      currentGame.name,
      currentGame.players(),
      owner,
      location,
      currentGame.link(),
    ]);
    await interaction.followUp(response);
  }

  private async createGameInteraction(
    interaction: CommandInteraction,
    list: BggGame[] | SheetGame[],
    components: MessageActionRow[]
  ): Promise<{
    message: Message;
    collector: InteractionCollector<Interaction>;
  }> {
    const message = await interaction.followUp({
      embeds: [this.getGameEmbed(interaction, list.length)],
      fetchReply: true,
      components: components,
    });

    if (!(message instanceof Message)) {
      throw Error('InvalidMessage instance');
    }

    const collector = message.createMessageComponentCollector();

    return { message, collector };
  }

  private getCurrentGame(interaction: CommandInteraction): BggGame | SheetGame {
    const currentIndex = Sheets._interactionIndex.get(interaction);
    const gamesList = Sheets._interactionGames.get(interaction);
    return gamesList[currentIndex];
  }

  private getCurrentIndex(interaction: CommandInteraction): number {
    return Sheets._interactionIndex.get(interaction);
  }

  private getAddGameButton(interaction: CommandInteraction): MessageButton {
    const currentGame = this.getCurrentGame(interaction);

    return new MessageButton({
      customId: `add-game`,
      style: MessageButtonStyles.PRIMARY,
      label: truncate(`Add: ${currentGame.name}`, { length: 80 }),
    });
  }

  private getNextButton(interaction: CommandInteraction): MessageButton {
    const currentIndex = this.getCurrentIndex(interaction);
    const gamesList = Sheets._interactionGames.get(interaction);

    return new MessageButton({
      customId: 'next-game',
      style: MessageButtonStyles.PRIMARY,
      label: 'Next',
      disabled: currentIndex === gamesList.length - 1,
    });
  }

  private getPreviousButton(interaction: CommandInteraction): MessageButton {
    const currentIndex = this.getCurrentIndex(interaction);

    return new MessageButton({
      customId: 'previous-game',
      style: MessageButtonStyles.PRIMARY,
      label: 'Previous',
      disabled: currentIndex === 0,
    });
  }

  private getActionRow(interaction: CommandInteraction) {
    return new MessageActionRow().addComponents(
      this.getPreviousButton(interaction),
      this.getNextButton(interaction),
      this.getAddGameButton(interaction)
    );
  }

  private getGameEmbed(
    interaction: CommandInteraction,
    totalGames: number
  ): MessageEmbed {
    const game = this.getCurrentGame(interaction);
    const currentIndex = this.getCurrentIndex(interaction);
    const embed = new MessageEmbed()
      .setFooter(`Game ${currentIndex + 1} of ${totalGames}`)
      .setTitle(truncate(game.name, { length: 80 }))
      .setThumbnail(game.thumbnail)
      .addField('Game Type', game.gameType(), true)
      .addField('Players', game.players(), true);

    game.yearPublished &&
      embed.addField('Year Published', game.yearPublished.toString(), false);
    game.link() && embed.addField('BGG Link', game.link(), false);

    return embed;
  }

  private decrementSheetInteractionIndex(
    interaction: CommandInteraction
  ): void {
    const currentIndex = this.getCurrentIndex(interaction);
    Sheets._interactionIndex.set(interaction, max([0, currentIndex - 1]));
  }

  private incrementSheetInteractionIndex(
    interaction: CommandInteraction
  ): void {
    const currentIndex = this.getCurrentIndex(interaction);
    const list = Sheets._interactionGames.get(interaction);

    Sheets._interactionIndex.set(
      interaction,
      min([list.length - 1, currentIndex + 1])
    );
  }

  private setSheetInteractionGames(
    list: BggGame[] | SheetGame[],
    interaction: CommandInteraction
  ) {
    Sheets._interactionGames.set(interaction, list);
    Sheets._interactionIndex.set(interaction, 0);
  }
}

export default Sheets;
