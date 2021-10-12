import axios from 'axios';
import { parse } from 'fast-xml-parser';
import { decode } from 'he';
import get from 'lodash/get';
import map from 'lodash/map';
export class BggGame {
  constructor(
    public id: string,
    public name: string,
    public type: string,
    public yearPublished: string,
    public minPlayers: string,
    public maxPlayers: string,
    public thumbnail: string
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
    return this.type === 'boardgame' ? 'Boardgame' : 'Boardgame Expansion';
  }
}

export class BggManager {
  private static _parserOptions = {
    attributeNamePrefix: '',
    ignoreAttributes: false,
    attrValueProcessor: (val, _attrName) => decode(val, { isAttributeValue: true }),
    tagValueProcessor: (val, _tagName) => decode(val),
  }

  static async getGameInfoById(gameId: string) {
    try {
      const response = await axios.get(`https://api.geekdo.com/xmlapi2/thing?id=${gameId}&versions=1`);
      const gameInfo = get(parse(response.data, this._parserOptions), 'items.item');
      return gameInfo;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async findGame(game: string) {
    const response = await axios.get(`https://api.geekdo.com/xmlapi2/search?query=${game}`);
    const games = get(parse(response.data, this._parserOptions), 'items.item');
    return map(games, (game: any) => new BggGame(
      game.id,
      game.name.value,
      game.type,
      get(game, 'yearpublished.value', ''),
      get(game, 'minplayers.value', ''),
      get(game, 'maxplayers.value', ''),
      get(game, 'thumbnail', ''),
    ));
  }

  static async findGameById(gameId: string) {
    const game = await BggManager.getGameInfoById(gameId);
    if (!game) return null;

    return new BggGame(
      game.id,
      game.name.value,
      game.type,
      get(game, 'yearpublished.value', ''),
      get(game, 'minplayers.value', ''),
      get(game, 'maxplayers.value', ''),
      get(game, 'thumbnail', ''),
    )
  }

  static async fillOutDetails(game: BggGame) {
    const gameInfo = await BggManager.getGameInfoById(game.id);
    if (!gameInfo) return null;

    game.minPlayers = get(gameInfo, 'minplayers.value', '');
    game.maxPlayers = get(gameInfo, 'maxplayers.value', '');
    game.thumbnail = get(gameInfo, 'thumbnail', '');
    return game;
  }
}

export default BggManager;
