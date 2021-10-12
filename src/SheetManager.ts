import {
  GoogleSpreadsheet,
  // GoogleSpreadsheetRow,
  GoogleSpreadsheetWorksheet,
} from 'google-spreadsheet';

export class SheetManager {
  document: GoogleSpreadsheet;

  construtor(): null {
    this.document = null;
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
      return;
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

  getSheet(index = 0): GoogleSpreadsheetWorksheet | null {
    if (!this.document) {
      return;
    }

    return this.document.sheetsByIndex[index];
  }
}

export default SheetManager;
