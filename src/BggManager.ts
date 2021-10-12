import axios from 'axios';
import { parse } from 'fast-xml-parser';
import { decode } from 'he';
import get from 'lodash/get';
import map from 'lodash/map';

interface IBggGame {
  id: string;
  name: string;
  type: string;
  yearPublished: string;
  minPlayers: string;
  maxPlayers: string;
  thumbnail: string;
}

class BggGame {
  public id: string;
  public name: string;
  public type: string;
  public yearPublished: string;
  public minPlayers: string;
  public maxPlayers: string;
  public thumbnail: string;

  constructor(game: IBggGame = {
    id: '',
    name: '',
    type: '',
    yearPublished: '',
    minPlayers: '',
    maxPlayers: '',
    thumbnail: '',
  } as IBggGame) {
    this.id = game.id;
    this.name = game.name;
    this.type = game.type;
    this.yearPublished = game.yearPublished;
    this.minPlayers = game.minPlayers;
    this.maxPlayers = game.maxPlayers;
    this.thumbnail = game.thumbnail;
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

  static async findGame(game: string) {
    const response = await axios.get(`https://api.geekdo.com/xmlapi2/search?query=${game}`);
    console.log(response.data);
    const games = get(parse(response.data, this._parserOptions), 'items.item');
    return map(games, (game: any) => new BggGame({
      id: game.id,
      name: game.name.value,
      type: game.type,
      yearPublished: get(game, 'yearpublished.value', ''),
      minPlayers: get(game, 'minplayers.value', ''),
      maxPlayers: get(game, 'maxplayers.value', ''),
      thumbnail: get(game, 'thumbnail', ''),
    }));
  }

  static async fillOutDetails(game: BggGame) {
    const response = await axios.get(`https://api.geekdo.com/xmlapi2/thing?id=${game.id}&versions=1`);
    const gameInfo = get(parse(response.data, this._parserOptions), 'items.item');
    game.minPlayers = get(gameInfo, 'minplayers.value', '');
    game.maxPlayers = get(gameInfo, 'maxplayers.value', '');
    game.thumbnail = get(gameInfo, 'thumbnail', '');
    return game;
  }
}

export default BggManager;
