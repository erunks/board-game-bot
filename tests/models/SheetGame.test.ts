import BggGame from '../../src/models/BggGame';
import SheetGame from '../../src/models/SheetGame';

describe('SheetGame', () => {
  const sheetGame = new SheetGame(
    'name',
    '1-4',
    'Me, Myself, & I',
    "A friend's house",
    'https://boardgamegeek.com/boardgame/1'
  );

  it('should create an instance', () => {
    expect(sheetGame).toBeTruthy();
  });

  describe('getters', () => {
    describe('.id', () => {
      it('should return the id', () => {
        expect(sheetGame.id).toBe('1');
      });
    });

    describe('.loaded', () => {
      it('should return loaded', () => {
        expect(sheetGame.loaded).toBe(true);
      });
    });

    describe('.minPlayers', () => {
      it('should return loaded', () => {
        expect(sheetGame.minPlayers).toBe('1');
      });
    });

    describe('.maxPlayers', () => {
      it('should return loaded', () => {
        expect(sheetGame.maxPlayers).toBe('4');
      });
    });

    describe('.thumbnail', () => {
      it('should return loaded', () => {
        expect(sheetGame.thumbnail).toBe('');
      });
    });

    describe('.type', () => {
      it('should return loaded', () => {
        expect(sheetGame.type).toBe('boardgame');
      });
    });

    describe('.yearPublished', () => {
      it('should return loaded', () => {
        expect(sheetGame.yearPublished).toBe(null);
      });
    });
  });

  describe('methods', () => {
    describe('#gameType', () => {
      it('should return the game type', () => {
        expect(sheetGame.gameType()).toBe(BggGame.gameType(sheetGame.type));
      });
    });

    describe('#link', () => {
      it('should return the link', () => {
        expect(sheetGame.link()).toBe(sheetGame.bggLink);
      });
    });

    describe('#players', () => {
      it('should return the players', () => {
        expect(sheetGame.players()).toBe(sheetGame.playerCount);
      });
    });
  });
});
