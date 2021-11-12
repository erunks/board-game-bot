import some from 'lodash/some';

export type TGameFilter = {
  name?: string;
  playerCount?: string;
  owner?: string;
  location?: string;
};

export interface IGameFilter {
  name?: string;
  playerCount?: string;
  owner?: string;
  location?: string;
}

export class GameFilter implements IGameFilter {
  public name: string;
  public playerCount: string;
  public owner: string;
  public location: string;

  constructor(filter: TGameFilter) {
    this.name = filter.name;
    this.playerCount = filter.playerCount;
    this.owner = filter.owner;
    this.location = filter.location;
  }

  hasAny(): boolean {
    return some(
      [this.name, this.playerCount, this.owner, this.location],
      (value) => !!value
    );
  }
}

export default GameFilter;
