import { CommandInteraction } from 'discord.js';
import {
  Discord,
  Slash,
  SlashOption
} from 'discordx';
import SheetManager from '../SheetManager';

@Discord()
export abstract class Sheets {
  @Slash('document', { description: 'Responds with a link to `The Library` sheet.'})
  async getDocument(interaction: CommandInteraction): Promise<void> {
    interaction.reply(`https://docs.google.com/spreadsheets/d/${process.env.GOOGLE_SHEET_ID}/`);
  }

  @Slash('addgame', { description: 'Adds a game to the sheet.' })
  // @Description('Adds a game to sheet. I.E. `/add_game :name :max_players :owner :location :bgg_link*`')
  async addGame(
    @SlashOption('game', { required: true }) game: string,
    @SlashOption('players', { required: true }) players: string,
    @SlashOption('owner', { required: true }) owner: string,
    @SlashOption('location', { required: true }) location: string,
    @SlashOption('bgglink', { required: false }) bggLink: string,
    interaction: CommandInteraction
  ): Promise<void> {
    const sheetManager = new SheetManager();
    await sheetManager.connect();
    const response = await sheetManager.addGame([game, players, owner, location, bggLink ?? '']);
    interaction.reply(response);
  }
}

export default Sheets;
