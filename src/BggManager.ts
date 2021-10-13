import axios from 'axios';
import { parse } from 'fast-xml-parser';
import { decode } from 'he';
import get from 'lodash/get';
import map from 'lodash/map';
import replace from 'lodash/replace';
export class BggGame {
  constructor(
    public id: string,
    public name: string,
    public type: string,
    public yearPublished: string,
    public minPlayers: string,
    public maxPlayers: string,
    public thumbnail: string,
    public loaded: boolean = false
  ) {
    return;
  }

  link(): string {
    return `https://boardgamegeek.com/${this.type}/${this.id}`;
  }

  players(): string {
    return `${this.minPlayers}-${this.maxPlayers}`;
  }

  gameType(): string {
    switch (this.type) {
      case 'boardgameexpansion':
        return 'Expansion';
      default:
        return 'Board Game';
    }
  }
}

export class BggManager {
  private static _parserOptions = {
    attributeNamePrefix: '',
    ignoreAttributes: false,
    attrValueProcessor: (val) => decode(val, { isAttributeValue: true }),
    tagValueProcessor: (val) => decode(val),
  };

  static async getGameInfoById(gameId: string): Promise<any | null> {
    try {
      const response = await axios.get(
        `https://api.geekdo.com/xmlapi2/thing?id=${gameId}&versions=1`
      );
      const gameInfo = get(
        parse(response.data, this._parserOptions),
        'items.item'
      );
      return gameInfo;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async findGame(game: string): Promise<BggGame[]> {
    const query = replace(game, /[^a-z0-9 ]/gi, '');
    const response = await axios.get(
      `https://api.geekdo.com/xmlapi2/search?query=${query}`
    );
    const games = get(parse(response.data, this._parserOptions), 'items.item');

    if (!games || games === undefined) {
      return [];
    } else if (games instanceof Array) {
      return map(games, (game) => this.createBggGame(game));
    }
    return [this.createBggGame(games)];
  }

  static async findGameById(gameId: string): Promise<BggGame> {
    const game = await BggManager.getGameInfoById(gameId);
    if (!game) return null;

    return this.createBggGame(game);
  }

  static async fillOutDetails(game: BggGame): Promise<BggGame> {
    const gameInfo = await BggManager.getGameInfoById(game.id);
    if (!gameInfo) return null;

    game.minPlayers = get(gameInfo, 'minplayers.value', '');
    game.maxPlayers = get(gameInfo, 'maxplayers.value', '');
    game.thumbnail = get(gameInfo, 'thumbnail', '');
    game.loaded = true;
    return game;
  }

  private static createBggGame(game: any): BggGame {
    return new BggGame(
      game.id,
      get(game, 'name.value', ''),
      game.type,
      get(game, 'yearpublished.value', ''),
      get(game, 'minplayers.value', ''),
      get(game, 'maxplayers.value', ''),
      get(game, 'thumbnail', '')
    );
  }
}

export default BggManager;
