export interface IBggGame {
  id: string;
  name: string;
  type: string;
  yearPublished: string;
  minPlayers: string;
  maxPlayers: string;
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

  gameType(): string {
    return BggGame.gameType(this.type);
  }

  link(): string {
    return `https://boardgamegeek.com/${this.type}/${this.id}`;
  }

  players(): string {
    if (this.minPlayers === this.maxPlayers) {
      return this.minPlayers;
    } else {
      return `${this.minPlayers}-${this.maxPlayers}`;
    }
  }
}

export default BggGame;
