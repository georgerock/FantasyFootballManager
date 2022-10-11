import createServer from '../util/server';
import supertest from 'supertest';
import * as CountryService from '../service/country.service';

const app = createServer(8000);

describe('country endpoints', () => {
  const countryId = 0;
  const countryData = {
    id: countryId,
    createdAt: Date.now().toString(),
    updatedAt: Date.now().toString(),
    iso: 'RO',
    iso3: 'ROU',
    name: 'ROMANIA',
    niceName: 'Romania',
  };
  describe('single country operations', () => {
    describe('given a valid id', () => {
      it('should return a valid country object', async () => {
        const countryServiceMock = jest
          .spyOn(CountryService, 'getCountryById')
          // @ts-ignore
          .mockReturnValueOnce(countryData);

        const { statusCode, body } = await supertest(app).get(
          `/countries/${countryId}`
        );

        expect(statusCode).toBe(200);
        expect(body).toEqual(countryData);
        expect(countryServiceMock).toHaveBeenCalledWith(countryId);
        expect(countryServiceMock).toHaveBeenCalledTimes(1);
      });
    }),
      describe('given a negative id', () => {
        it('should return invalid id error', async () => {
          const countryServiceMock = jest
            .spyOn(CountryService, 'getCountryById')
            // @ts-ignore
            .mockReturnValueOnce(countryData);

          const { statusCode, body } = await supertest(app).get(
            '/countries/-1'
          );

          expect(statusCode).toBe(400);
          expect(body[0].message).toBe('Invalid country id');
          expect(countryServiceMock).not.toHaveBeenCalled();
        });
      }),
      describe('given a nonexistant id', () => {
        it('should return id not found error', async () => {
          const countryServiceMock = jest
            .spyOn(CountryService, 'getCountryById')
            // @ts-ignore
            .mockReturnValueOnce(null);

          const { statusCode, body } = await supertest(app).get(
            `/countries/${countryId}`
          );

          expect(statusCode).toBe(404);
          expect(body[0].message).toBe('Country not found');
          expect(countryServiceMock).toHaveBeenCalledWith(countryId);
          expect(countryServiceMock).toHaveBeenCalledTimes(1);
        });
      });
  });
});
