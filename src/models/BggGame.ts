export interface IBggGame {
  id: number;
  name: string;
  type: string;
  yearPublished: number;
  minPlayers: number;
  maxPlayers: number;
  thumbnail: string;
  loaded: boolean;
}

export class BggGame implements IBggGame {
  public static gameType(type: string): string {
    switch (type) {
      case 'boardgameexpansion':
        return 'Expansion';
      default:
        return 'Board Game';
    }
  }

  constructor(
    public id: number,
    public name: string,
    public type: string,
    public yearPublished: number,
    public minPlayers: number,
    public maxPlayers: number,
    public thumbnail: string,
    public loaded: boolean = false
  ) {
    return;
  }

  gameType(): string {
    return BggGame.gameType(this.type);
  }

  link(): string {
    return `https://boardgamegeek.com/${this.type}/${this.id}`;
  }

  players(): string {
    if (this.minPlayers === this.maxPlayers) {
      return this.minPlayers.toString();
    } else {
      return `${this.minPlayers}-${this.maxPlayers}`;
    }
  }
}

export default BggGame;
