import axios from 'axios';
import fs from 'fs';
import path from 'path';
import BggManager from '../../src/managers/BggManager';
import BggGame from '../../src/models/BggGame';

// This silences the error logging
console.error = jest.fn();

const getSpy = jest.spyOn(axios, 'get');

const loadFixture = (fixture) => {
  const xml = fs.readFileSync(
    path.join(__dirname, `../fixtures/${fixture}`),
    'utf8'
  );
  return xml;
};

describe('BggManager', () => {
  it('should be defined', () => {
    expect(BggManager).toBeDefined();
  });

  describe('#getGameInfoById', () => {
    describe('when the request succeeds', () => {
      const response = { data: loadFixture('secret_hitler_thing.xml') };
      it('returns the json data', () => {
        getSpy.mockImplementation(() => Promise.resolve(response));
        expect(BggManager.getGameInfoById('188834')).resolves.toMatchSnapshot();
        expect(getSpy).toHaveBeenCalledWith(
          'https://api.geekdo.com/xmlapi2/thing?id=188834&versions=1'
        );
      });
    });

    describe('when the request fails', () => {
      it('returns null', () => {
        getSpy.mockImplementation(() => Promise.reject('This should error'));
        expect(BggManager.getGameInfoById('-1')).resolves.toBeNull();
        expect(getSpy).toHaveBeenCalledWith(
          'https://api.geekdo.com/xmlapi2/thing?id=-1&versions=1'
        );
      });
    });
  });

  describe('#findGame', () => {
    describe('when the request succeeds with multiple results', () => {
      const response = { data: loadFixture('secret_hitler_search.xml') };
      const expectedGames = [
        new BggGame(
          '188834',
          'Secret Hitler',
          'boardgame',
          '2016',
          '',
          '',
          '',
          false
        ),
        new BggGame(
          '77057',
          "Hitler's Revival: Top Secret",
          'videogame',
          '',
          '',
          '',
          '',
          false
        ),
      ];

      it('returns BggGame[]', () => {
        getSpy.mockImplementation(() => Promise.resolve(response));
        expect(BggManager.findGame('secret hitler')).resolves.toEqual(
          expectedGames
        );
        expect(getSpy).toHaveBeenCalledWith(
          'https://api.geekdo.com/xmlapi2/search?query=secret hitler'
        );
      });
    });

    describe('when the request succeeds with only one result', () => {
      const response = { data: loadFixture('only_one_search_result.xml') };
      const expectedGames = [
        new BggGame(
          '188834',
          'Secret Hitler',
          'boardgame',
          '2016',
          '',
          '',
          '',
          false
        ),
      ];

      it('returns BggGame[]', () => {
        getSpy.mockImplementation(() => Promise.resolve(response));
        expect(BggManager.findGame('secret hitler')).resolves.toEqual(
          expectedGames
        );
        expect(getSpy).toHaveBeenCalledWith(
          'https://api.geekdo.com/xmlapi2/search?query=secret hitler'
        );
      });
    });

    describe('when the request succeeds, but nothing was found', () => {
      const response = { data: loadFixture('empty_search_results.xml') };
      it('returns an empty BggGame[]', () => {
        getSpy.mockImplementation(() => Promise.resolve(response));
        expect(BggManager.findGame('secret hitler')).resolves.toEqual([]);
        expect(getSpy).toHaveBeenCalledWith(
          'https://api.geekdo.com/xmlapi2/search?query=secret hitler'
        );
      });
    });

    describe('when the request fails', () => {
      it('returns an empty BggGame[]', () => {
        getSpy.mockImplementation(() => Promise.reject('This should error'));
        expect(BggManager.findGame('secret hitler')).resolves.toEqual([]);
        expect(getSpy).toHaveBeenCalledWith(
          'https://api.geekdo.com/xmlapi2/search?query=secret hitler'
        );
      });
    });
  });

  describe('#findGameById', () => {
    describe('when the request succeeds', () => {
      const response = { data: loadFixture('secret_hitler_thing.xml') };
      const expectedGame = new BggGame(
        '188834',
        'Secret Hitler',
        'boardgame',
        '2016',
        '5',
        '10',
        'https://cf.geekdo-images.com/rAQ3hIXoH6xDcj41v9iqCg__thumb/img/xA2T7PiwN3Z8pwAksicoCOA1tf0=/fit-in/200x150/filters:strip_icc()/pic5164305.jpg',
        true
      );

      it('returns the json data', () => {
        getSpy.mockImplementation(() => Promise.resolve(response));
        expect(BggManager.findGameById('188834')).resolves.toEqual(
          expectedGame
        );
        expect(getSpy).toHaveBeenCalledWith(
          'https://api.geekdo.com/xmlapi2/thing?id=188834&versions=1'
        );
      });
    });

    describe('when the request fails', () => {
      it('returns null', () => {
        getSpy.mockImplementation(() => Promise.reject('This should error'));
        expect(BggManager.findGameById('-1')).resolves.toBeNull();
        expect(getSpy).toHaveBeenCalledWith(
          'https://api.geekdo.com/xmlapi2/thing?id=-1&versions=1'
        );
      });
    });
  });

  describe('#fillOutDetails', () => {
    const initalGame = new BggGame(
      '188834',
      'Secret Hitler',
      'boardgame',
      '2016',
      '',
      '',
      '',
      false
    );

    describe('when the request succeeds', () => {
      const response = { data: loadFixture('secret_hitler_thing.xml') };
      const expectedGame = new BggGame(
        '188834',
        'Secret Hitler',
        'boardgame',
        '2016',
        '5',
        '10',
        'https://cf.geekdo-images.com/rAQ3hIXoH6xDcj41v9iqCg__thumb/img/xA2T7PiwN3Z8pwAksicoCOA1tf0=/fit-in/200x150/filters:strip_icc()/pic5164305.jpg',
        true
      );

      it('returns a game with the information filled out', () => {
        getSpy.mockImplementation(() => Promise.resolve(response));
        expect(BggManager.fillOutDetails(initalGame)).resolves.toEqual(
          expectedGame
        );
        expect(getSpy).toHaveBeenCalledWith(
          'https://api.geekdo.com/xmlapi2/thing?id=188834&versions=1'
        );
      });
    });

    describe('when the request fails', () => {
      it('returns null', () => {
        getSpy.mockImplementation(() => Promise.reject('This should error'));
        expect(BggManager.fillOutDetails(initalGame)).resolves.toBeNull();
        expect(getSpy).toHaveBeenCalledWith(
          'https://api.geekdo.com/xmlapi2/thing?id=188834&versions=1'
        );
      });
    });
  });
});
