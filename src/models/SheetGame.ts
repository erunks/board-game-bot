import { GoogleSpreadsheetRow } from 'google-spreadsheet';
import get from 'lodash/get';
import includes from 'lodash/includes';
import inRange from 'lodash/inRange';
import lowerCase from 'lodash/lowerCase';
import some from 'lodash/some';
import split from 'lodash/split';
import words from 'lodash/words';
import GameFilter from './GameFilter';
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

  get id(): number {
    const bggIdRegex = /.*boardgamegeek.+\/(\d+).*/i;
    const matches = this.bggLink.match(bggIdRegex);

    return parseInt(get(matches, '[1]', '-1'));
  }

  get loaded(): boolean {
    return true;
  }

  get minPlayers(): number {
    return parseInt(split(this.playerCount, '-')[0]);
  }

  get maxPlayers(): number {
    const result = split(this.playerCount, '-');
    return parseInt(get(result, '[1]', get(result, '[0]', '0')));
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

  _similarTo(field: string, value: string): boolean {
    const fieldValue = this[field];
    const valueWords = words(lowerCase(value));
    const fieldWords = words(lowerCase(fieldValue));

    return some(valueWords, (word) => includes(fieldWords, word));
  }

  gameType(): string {
    return BggGame.gameType(this.type);
  }

  like(filter: GameFilter): boolean {
    const likeName = this._similarTo('name', filter.name);
    const likeOwner = this._similarTo('owner', filter.owner);
    const likeLocation = this._similarTo('location', filter.location);
    const playerCountWords = words(filter.playerCount);
    let likePlayerCount: boolean;
    if (playerCountWords.length > 1) {
      likePlayerCount = some(playerCountWords, (count) =>
        inRange(parseInt(count), this.minPlayers, this.maxPlayers)
      );
    } else {
      likePlayerCount = inRange(
        parseInt(playerCountWords[0]),
        this.minPlayers,
        this.maxPlayers
      );
    }

    return likeName || likeOwner || likeLocation || likePlayerCount;
  }

  link(): string {
    return this.bggLink;
  }

  players(): string {
    return this.playerCount;
  }
}

export default SheetGame;
