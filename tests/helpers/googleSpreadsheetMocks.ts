import {
  CellFormat,
  GoogleSpreadsheet,
  GoogleSpreadsheetRow,
  GoogleSpreadsheetWorksheet,
  IterativeCalculationSetting,
  RecalculationInterval,
  SpreadsheetTheme,
} from 'google-spreadsheet';
import assign from 'lodash/assign';

const googleSpreadsheetOptions = {
  addNamedRange: jest.fn(),
  addSheet: jest.fn(),
  addWorksheet: jest.fn(),
  autoRecalc: 'ONCE' as RecalculationInterval,
  createNewSpreadsheetDocument: jest.fn(),
  defaultFormat: {} as CellFormat,
  defaultTheme: 'default',
  deleteNamedRange: jest.fn(),
  deleteSheet: jest.fn(),
  headerRow: 1,
  iterativeCalculationSettings: {} as IterativeCalculationSetting,
  loadInfo: jest.fn(),
  locale: 'en',
  resetLocalCache: jest.fn(),
  sheetCount: 0,
  sheetsById: {},
  sheetsByIndex: [],
  sheetsByTitle: {},
  spreadsheetId: '1',
  spreadsheetTheme: {} as SpreadsheetTheme,
  timeZone: 'America/Los_Angeles',
  title: 'Test Spreadsheet',
  updateProperties: jest.fn(),
  useApiKey: jest.fn(),
  useOAuth2Client: jest.fn(),
  useRawAccessToken: jest.fn(),
  useServiceAccountAuth: jest.fn(),
};

const googleSpreadsheetRowOptions = {
  a1Range: 'Sheet1!A1:E1',
  delete: jest.fn(),
  rowIndex: 1,
  save: jest.fn(),
  Game: "Liar's Dice",
  'Player Count': '1-4',
  Owner: 'Me, Myself, & I',
  Location: "A friend's house",
  'BGG Link': 'https://boardgamegeek.com/boardgame/12345',
};

const googleSpreadsheetWorksheetOptions = {
  a1SheetName: '',
  addRow: jest.fn(),
  addRows: jest.fn(),
  cellStats: { nonEmpty: 0, loaded: 0, total: 0 },
  clear: jest.fn(),
  columnCount: 0,
  copyToSpreadsheet: jest.fn(),
  delete: jest.fn(),
  getCell: jest.fn(),
  getCellByA1: jest.fn(),
  getRows: jest.fn(),
  gridProperties: {},
  headerValues: [],
  hidden: false,
  index: 0,
  lastColumnLetter: 'Z',
  loadCells: jest.fn(),
  loadHeaderRow: jest.fn(),
  resetLocalCache: jest.fn(),
  resize: jest.fn(),
  rightToLeft: false,
  rowCount: 0,
  saveCells: jest.fn(),
  saveUpdatedCells: jest.fn(),
  setGridProperties: jest.fn(),
  setHeaderRow: jest.fn(),
  sheetId: '1',
  sheetType: 'GRID',
  tabColor: { red: 0, green: 0, blue: 0, alpha: 0 },
  title: '',
  updateDimensionProperties: jest.fn(),
  updateProperties: jest.fn(),
};

export const createMockGoogleSpreadsheet = (
  options: unknown = googleSpreadsheetOptions
): GoogleSpreadsheet =>
  ({
    ...assign(googleSpreadsheetOptions, options),
  } as GoogleSpreadsheet);

export const createMockGoogleSpreadsheetRow = (
  options: unknown = googleSpreadsheetRowOptions
): GoogleSpreadsheetRow =>
  ({
    ...assign(googleSpreadsheetRowOptions, options),
  } as GoogleSpreadsheetRow);

export const createMockGoogleSpreadsheetWorksheet = (
  options: unknown = googleSpreadsheetWorksheetOptions
): GoogleSpreadsheetWorksheet =>
  ({
    ...assign(googleSpreadsheetWorksheetOptions, options),
  } as GoogleSpreadsheetWorksheet);

export default {
  createMockGoogleSpreadsheet,
  createMockGoogleSpreadsheetRow,
  createMockGoogleSpreadsheetWorksheet,
};
