// import {
//   Discord,
//   Description,
// } from '@typeit/discord';
// // import SheetManager from '../SheetManager';

// @Discord()
// @Description('Sheet Commands list')
// export abstract class SheetCommands {
//   // @Command('document_link')
//   // @Description('Responds with a link to `The Library` sheet.')
//   // async ping(command: CommandMessage): Promise<void> {
//   //   command.reply(`https://docs.google.com/spreadsheets/d/${process.env.GOOGLE_SHEET_ID}/`);
//   // }

//   // @Command('add_game :game :genre :owner :location')
//   // @Description('Adds a game to sheet. I.E. `/add_game :name :max_players :owner :location :bgg_link*`')
//   // async addGame(command: CommandMessage): Promise<void> {
//   //   const { game, max_player_count, owner, location } = command.args;
//   //   const sheetManager = new SheetManager();
//   //   await sheetManager.connect();
//   //   const response = await sheetManager.addGame([game, max_player_count, owner, location]);
//   //   command.reply(response);
//   // }
// }

// export default SheetCommands;
