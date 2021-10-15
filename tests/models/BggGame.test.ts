import BggGame from '../../src/models/BggGame';

describe('BggGame', () => {
  it('should create an instance', () => {
    expect(
      new BggGame(
        '1',
        'name',
        'type',
        'yearPublished',
        'minPlayers',
        'maxPlayers',
        'thumbnail'
      )
    ).toBeTruthy();
  });

  describe('#gameType', () => {
    const game = new BggGame(
      '1',
      'name',
      'boardgame',
      'yearPublished',
      'minPlayers',
      'maxPlayers',
      'thumbnail'
    );

    it('should return `Board Game` by default', () => {
      expect(game.gameType()).toBe('Board Game');
    });

    describe('when the type is an expansion', () => {
      it('should return the game type as a pretty string', () => {
        game.type = 'boardgameexpansion';
        expect(game.gameType()).toEqual('Expansion');
      });
    });
  });

  describe('#link', () => {
    it('should return a link to the game', () => {
      const game = new BggGame(
        '1',
        'name',
        'boardgame',
        'yearPublished',
        'minPlayers',
        'maxPlayers',
        'thumbnail'
      );

      expect(game.link()).toEqual('https://boardgamegeek.com/boardgame/1');
    });
  });

  describe('#players', () => {
    it('should return a string with the number of players', () => {
      const game = new BggGame(
        '1',
        'name',
        'boardgame',
        'yearPublished',
        '1',
        '5',
        'thumbnail'
      );

      expect(game.players()).toEqual('1-5');
    });

    describe('when minPlayers and maxPlayers are the same', () => {
      it('should return a string with the number of players', () => {
        const game = new BggGame(
          '1',
          'name',
          'boardgame',
          'yearPublished',
          '2',
          '2',
          'thumbnail'
        );

        expect(game.players()).toEqual('2');
      });
    });
  });
});
