import BggGame from '../../src/models/BggGame';

describe('BggGame', () => {
  const game = new BggGame(1, 'name', 'boardgame', 1970, 1, 5, 'thumbnail');

  it('should create an instance', () => {
    expect(game).toBeTruthy();
  });

  describe('methods', () => {
    describe('#gameType', () => {
      it('should return `Board Game` by default', () => {
        expect(game.gameType()).toBe('Board Game');
      });

      describe('when the type is an expansion', () => {
        it('should return the game type as a pretty string', () => {
          const game = new BggGame(
            1,
            'name',
            'boardgameexpansion',
            1970,
            1,
            5,
            'thumbnail'
          );
          expect(game.gameType()).toEqual('Expansion');
        });
      });
    });

    describe('#link', () => {
      it('should return a link to the game', () => {
        expect(game.link()).toEqual('https://boardgamegeek.com/boardgame/1');
      });
    });

    describe('#players', () => {
      it('should return a string with the number of players', () => {
        expect(game.players()).toEqual('1-5');
      });

      describe('when minPlayers and maxPlayers are the same', () => {
        it('should return a string with the number of players', () => {
          const game = new BggGame(1, 'name', 'type', 1970, 2, 2, 'thumbnail');

          expect(game.players()).toEqual('2');
        });
      });
    });
  });
});
