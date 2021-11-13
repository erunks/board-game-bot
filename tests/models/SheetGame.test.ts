import { createMockGoogleSpreadsheetRow } from '../helpers/googleSpreadsheetMocks';
import BggGame from '../../src/models/BggGame';
import GameFilter from '../../src/models/GameFilter';
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

  describe('static methods', () => {
    describe('#fromSpreadsheetRow', () => {
      const row = createMockGoogleSpreadsheetRow();

      it('should create a SheetGame from a spreadsheet row', () => {
        const sheetGame = SheetGame.fromSpreadsheetRow(row);
        expect(sheetGame).toBeTruthy();
        expect(sheetGame.name).toEqual("Liar's Dice");
        expect(sheetGame.playerCount).toEqual('1-4');
        expect(sheetGame.owner).toEqual('Me, Myself, & I');
        expect(sheetGame.location).toEqual("A friend's house");
        expect(sheetGame.bggLink).toEqual(
          'https://boardgamegeek.com/boardgame/12345'
        );
      });
    });
  });

  describe('getters', () => {
    describe('.id', () => {
      it('should return the id', () => {
        expect(sheetGame.id).toBe(1);
      });
    });

    describe('.loaded', () => {
      it('should return loaded', () => {
        expect(sheetGame.loaded).toBe(true);
      });
    });

    describe('.minPlayers', () => {
      it('should return min players as an int', () => {
        expect(sheetGame.minPlayers).toBe(1);
      });
    });

    describe('.maxPlayers', () => {
      it('should return max players as an int', () => {
        expect(sheetGame.maxPlayers).toBe(4);
      });
    });

    describe('.thumbnail', () => {
      it('should return the thumbnail', () => {
        expect(sheetGame.thumbnail).toBe('');
      });
    });

    describe('.type', () => {
      it('should return the type', () => {
        expect(sheetGame.type).toBe('boardgame');
      });
    });

    describe('.yearPublished', () => {
      it('should return the year published', () => {
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

    describe('#like', () => {
      const game = new SheetGame(
        'Teenage Mutant Ninja Turtles III: The Manhattan Project',
        '1-4',
        'Me, Myself, & I',
        "A friend's house",
        'https://boardgamegeek.com/boardgame/1'
      );

      describe('when it matches the filter', () => {
        it('returns true', () => {
          expect(game.like(new GameFilter({ name: 'ninja' }))).toBe(true);
        });

        it('returns true', () => {
          expect(game.like(new GameFilter({ playerCount: '2' }))).toBe(true);
        });

        it('returns true', () => {
          expect(game.like(new GameFilter({ playerCount: '1-3' }))).toBe(true);
        });

        it('returns true', () => {
          expect(game.like(new GameFilter({ owner: 'myself' }))).toBe(true);
        });

        it('returns true', () => {
          expect(game.like(new GameFilter({ location: 'house' }))).toBe(true);
        });
      });

      describe('when it does not match the filter', () => {
        it('returns false', () => {
          expect(game.like(new GameFilter({ name: 'pizaa' }))).toBe(false);
        });

        it('returns false', () => {
          expect(game.like(new GameFilter({ playerCount: '5' }))).toBe(false);
        });

        it('returns false', () => {
          expect(game.like(new GameFilter({ playerCount: '5-8' }))).toBe(false);
        });

        it('returns false', () => {
          expect(game.like(new GameFilter({ owner: 'someone' }))).toBe(false);
        });

        it('returns false', () => {
          expect(game.like(new GameFilter({ location: 'home' }))).toBe(false);
        });
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
