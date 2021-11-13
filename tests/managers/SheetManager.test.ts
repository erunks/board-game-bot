import {
  createMockGoogleSpreadsheet,
  createMockGoogleSpreadsheetRow,
  createMockGoogleSpreadsheetWorksheet,
} from '../helpers/googleSpreadsheetMocks';
import SheetManager from '../../src/managers/SheetManager';
import GameFilter from '../../src/models/GameFilter';
import SheetGame from '../../src/models/SheetGame';

// This silences the console logging
console.log = jest.fn();
console.error = jest.fn();

const mockProcessExit = jest.fn() as never;
process.exit = mockProcessExit;

const mockUseServiceAccountAuth = jest.fn();
const mockLoadInfo = jest.fn();
jest.mock('google-spreadsheet', () => ({
  GoogleSpreadsheet: jest.fn(() =>
    createMockGoogleSpreadsheet({
      loadInfo: mockLoadInfo,
      useServiceAccountAuth: mockUseServiceAccountAuth,
    })
  ),
}));

beforeEach(jest.clearAllMocks);
afterAll(jest.resetAllMocks);

describe('SheetManager', () => {
  it('should be defined', () => {
    expect(SheetManager).toBeDefined();
  });

  it('should be able to create a new SheetManager instance', () => {
    const sheetManager = new SheetManager();
    expect(sheetManager).toBeTruthy();
    expect(sheetManager.document).toBe(null);
  });

  describe('methods', () => {
    describe('#connect', () => {
      it('should auth and load the info', async () => {
        const sheetManager = new SheetManager();
        await sheetManager.connect();

        expect(mockUseServiceAccountAuth).toHaveBeenCalled();
        expect(mockLoadInfo).toHaveBeenCalled();
      });

      describe('when the useServiceAccountAuth fails', () => {
        it('should throw an error', async () => {
          mockUseServiceAccountAuth.mockImplementation(() =>
            Promise.reject('Test error')
          );
          const sheetManager = new SheetManager();
          await sheetManager.connect();

          expect(console.error).toHaveBeenCalledWith('Test error');
          expect(mockProcessExit).toHaveBeenCalledWith(1);
        });
      });

      describe('when the loadInfo fails', () => {
        it('should throw an error', async () => {
          mockLoadInfo.mockImplementation(() => Promise.reject('Test error'));
          const sheetManager = new SheetManager();
          await sheetManager.connect();

          expect(console.error).toHaveBeenCalledWith('Test error');
          expect(mockProcessExit).toHaveBeenCalledWith(1);
        });
      });
    });

    describe('#addGame', () => {
      const gameInfo = [
        "Liar's Dice",
        '1-4',
        'Me, Myself, & I',
        "A friend's house",
        'https://www.boardgamegeek.com/boardgame/12345',
      ];
      const mockSheet = createMockGoogleSpreadsheetWorksheet({
        addRow: jest.fn(() =>
          Promise.resolve(createMockGoogleSpreadsheetRow())
        ),
      });

      it('should add a new game to the sheet', async () => {
        const sheetManager = new SheetManager();
        sheetManager.document = createMockGoogleSpreadsheet({
          sheetsByIndex: [mockSheet],
        });
        const response = await sheetManager.addGame(gameInfo);

        expect(mockSheet.addRow).toHaveBeenCalledWith(gameInfo);
        expect(response).toBe(`Successfully added ${gameInfo[0]}`);
      });

      describe('when the addRow operation fails', () => {
        const mockSheet = createMockGoogleSpreadsheetWorksheet({
          addRow: jest.fn(() => Promise.reject('Test error')),
        });

        it('should throw an error', async () => {
          const sheetManager = new SheetManager();
          sheetManager.document = createMockGoogleSpreadsheet({
            sheetsByIndex: [mockSheet],
          });
          const response = await sheetManager.addGame(gameInfo);

          expect(mockSheet.addRow).toHaveBeenCalledWith(gameInfo);
          expect(console.error).toHaveBeenCalledWith('Test error');
          expect(response).toBe(`Failed to add ${gameInfo[0]}`);
        });
      });

      describe('when not the document has not been set', () => {
        it('should return an empty string', async () => {
          const sheetManager = new SheetManager();
          const response = await sheetManager.addGame(gameInfo);
          expect(response).toBe('');
        });
      });
    });

    describe('#getGames', () => {
      const mockSheet = createMockGoogleSpreadsheetWorksheet({
        getRows: jest.fn(() => [createMockGoogleSpreadsheetRow()]),
      });

      it('should return an array of SheetGames', async () => {
        const sheetManager = new SheetManager();
        sheetManager.document = createMockGoogleSpreadsheet({
          sheetsByIndex: [mockSheet],
        });

        const [response] = await sheetManager.getGames();
        expect(response).toBeInstanceOf(SheetGame);
        expect(response.name).toBe("Liar's Dice");
        expect(response.playerCount).toBe('1-4');
        expect(response.owner).toBe('Me, Myself, & I');
        expect(response.location).toBe("A friend's house");
        expect(response.bggLink).toBe(
          'https://boardgamegeek.com/boardgame/12345'
        );
      });

      describe('when a gameFilter is passed', () => {
        const gameFilter = new GameFilter({
          name: 'secret',
        });

        it('should filter the games', async () => {
          const sheetManager = new SheetManager();
          sheetManager.document = createMockGoogleSpreadsheet({
            sheetsByIndex: [mockSheet],
          });

          const response = await sheetManager.getGames(gameFilter);
          expect(response.length).toBe(0);
        });
      });

      describe('when not the document has not been set', () => {
        it('should return an empty array', async () => {
          const sheetManager = new SheetManager();
          const response = await sheetManager.getGames();

          expect(response).toBeInstanceOf(Array);
          expect(response.length).toBe(0);
        });
      });
    });

    describe('#getSheet', () => {
      const mockSheet = createMockGoogleSpreadsheetWorksheet();

      it('should return the GoogleSpreadsheetWorksheet from an index', () => {
        const sheetManager = new SheetManager();
        sheetManager.document = createMockGoogleSpreadsheet({
          sheetsByIndex: [mockSheet],
        });

        expect(sheetManager.getSheet(0)).toBe(mockSheet);
      });

      describe('when not the document has not been set', () => {
        it('should return null', () => {
          const sheetManager = new SheetManager();
          expect(sheetManager.getSheet(0)).toBe(null);
        });
      });
    });
  });
});
