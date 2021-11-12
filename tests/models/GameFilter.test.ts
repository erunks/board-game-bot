import GameFilter from '../../src/models/GameFilter';

describe('GameFilter', () => {
  const gameFilter = new GameFilter({
    name: 'Name filter',
  });

  it('should create an instance', () => {
    expect(gameFilter).toBeTruthy();
  });

  describe('methods', () => {
    describe('#hasAny', () => {
      it('should return true if any of the filters are defined', () => {
        expect(gameFilter.hasAny()).toBe(true);
      });

      it('should return false if none of the filters are defined', () => {
        const gameFilter = new GameFilter({});
        expect(gameFilter.hasAny()).toBe(false);
      });
    });
  });
});
