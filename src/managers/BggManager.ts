import axios, { AxiosResponse } from 'axios';
import { parse } from 'fast-xml-parser';
import { decode } from 'he';
import get from 'lodash/get';
import map from 'lodash/map';
import replace from 'lodash/replace';
import BggGame, { IBggGame } from '../models/BggGame';

export class BggManager {
  private static _parserOptions = {
    attributeNamePrefix: '',
    ignoreAttributes: false,
    attrValueProcessor: (val, attrName) => {
      const processedValue = decode(val, { isAttributeValue: true });
      if (attrName === 'id') {
        return parseInt(processedValue);
      }
      return processedValue;
    },
    tagValueProcessor: (val) => decode(val),
  };

  private static _parseXMLResponse(
    response: AxiosResponse
  ): IBggGame[] | IBggGame | undefined {
    return get(parse(response.data, this._parserOptions), 'items.item');
  }

  static async getGameInfoById(gameId: number): Promise<IBggGame | null> {
    try {
      const response = await axios.get(
        `https://api.geekdo.com/xmlapi2/thing?id=${gameId}&versions=1`
      );
      return this._parseXMLResponse(response) as IBggGame;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async findGame(game: string): Promise<BggGame[]> {
    try {
      const query = replace(game, /[^a-z0-9 ]/gi, '');
      const response = await axios.get(
        `https://api.geekdo.com/xmlapi2/search?query=${query}`
      );
      const games = this._parseXMLResponse(response);

      if (!games || games === undefined) {
        return [] as BggGame[];
      } else if (games instanceof Array) {
        return map(games, (game) => this.createBggGame(game));
      }
      return [this.createBggGame(games)];
    } catch (error) {
      console.error(error);
      return [] as BggGame[];
    }
  }

  static async findGameById(gameId: number): Promise<BggGame | null> {
    const game = await BggManager.getGameInfoById(gameId);
    if (!game) return null;

    return this.createBggGame({ ...game, loaded: true } as IBggGame);
  }

  static async fillOutDetails(game: BggGame): Promise<BggGame | null> {
    const gameInfo = await BggManager.getGameInfoById(game.id);
    if (!gameInfo) return null;

    game.minPlayers = parseInt(get(gameInfo, 'minplayers.value', 0));
    game.maxPlayers = parseInt(get(gameInfo, 'maxplayers.value', 0));
    game.thumbnail = get(gameInfo, 'thumbnail', '');
    game.loaded = true;
    return game;
  }

  private static createBggGame(game: IBggGame): BggGame {
    return new BggGame(
      game.id,
      get(game, 'name.value', ''),
      game.type,
      parseInt(get(game, 'yearpublished.value', 0)),
      parseInt(get(game, 'minplayers.value', 0)),
      parseInt(get(game, 'maxplayers.value', 0)),
      get(game, 'thumbnail', ''),
      get(game, 'loaded', false)
    );
  }
}

export default BggManager;
