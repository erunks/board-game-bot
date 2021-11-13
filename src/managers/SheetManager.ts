import {
  GoogleSpreadsheet,
  GoogleSpreadsheetRow,
  GoogleSpreadsheetWorksheet,
} from 'google-spreadsheet';
import GameFilter from '../models/GameFilter';
import SheetGame from '../models/SheetGame';
import filter from 'lodash/filter';
import map from 'lodash/map';

export class SheetManager {
  constructor(public document: GoogleSpreadsheet = null) {
    return;
  }

  async connect(): Promise<GoogleSpreadsheet> {
    console.log('Initializing Google Spreadsheet...');

    this.document = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
    try {
      await this.document.useServiceAccountAuth({
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY,
      });
      await this.document.loadInfo();
    } catch (err) {
      console.error(err);
      process.exit(1);
    }

    console.log(`Loaded document: ${this.document.title}`);

    return this.document;
  }

  async addGame(gameInfo: string[]): Promise<string> {
    if (!this.document) {
      return '';
    }

    const sheet = this.getSheet();
    try {
      await sheet.addRow(gameInfo);
      return `Successfully added ${gameInfo[0]}`;
    } catch (err) {
      console.error(err);
      return `Failed to add ${gameInfo[0]}`;
    }
  }

  async getGames(gameFilter?: GameFilter): Promise<SheetGame[]> {
    if (!this.document) {
      return [];
    }

    const sheet = this.getSheet();
    const rows: GoogleSpreadsheetRow[] = await sheet.getRows();
    let sheetGames = map(rows, (row) => SheetGame.fromSpreadsheetRow(row));

    if (gameFilter && gameFilter.hasAny()) {
      sheetGames = filter(sheetGames, (game) => game.like(gameFilter));
    }

    return sheetGames;
  }

  getSheet(index = 0): GoogleSpreadsheetWorksheet | null {
    if (!this.document) {
      return null;
    }

    return this.document.sheetsByIndex[index];
  }
}

export default SheetManager;
