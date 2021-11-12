import { GoogleSpreadsheetRow } from 'google-spreadsheet';
import get from 'lodash/get';
import split from 'lodash/split';
import BggGame from './BggGame';

export interface ISheetGame {
  name: string;
  playerCount: string;
  owner: string;
  location: string;
  bggLink: string;
}

export class SheetGame implements ISheetGame {
  public static fromSpreadsheetRow(row: GoogleSpreadsheetRow): SheetGame {
    return new SheetGame(
      get(row, 'Game'),
      get(row, 'Player Count'),
      get(row, 'Owner'),
      get(row, 'Location'),
      get(row, 'BGG Link')
    );
  }

  constructor(
    public name: string,
    public playerCount: string,
    public owner: string,
    public location: string,
    public bggLink: string
  ) {
    return;
  }

  get id(): string {
    const bggIdRegex = /.*boardgamegeek.+\/(\d+).*/i;
    const matches = this.bggLink.match(bggIdRegex);

    return get(matches, '[1]', '-1');
  }

  get loaded(): boolean {
    return true;
  }

  get minPlayers(): string {
    return split(this.playerCount, '-')[0];
  }

  get maxPlayers(): string {
    const result = split(this.playerCount, '-');
    return get(result, '[1]', get(result, '[0]', '0'));
  }

  get thumbnail(): string {
    return '';
  }

  get type(): string {
    const bggLinkRegex = /.*boardgamegeek.+\/(.+)\/\d+.*/i;
    const matches = this.bggLink.match(bggLinkRegex);

    return get(matches, '[1]', 'unknown');
  }

  get yearPublished(): null {
    return null;
  }

  gameType(): string {
    return BggGame.gameType(this.type);
  }

  link(): string {
    return this.bggLink;
  }

  players(): string {
    return this.playerCount;
  }
}

export default SheetGame;
