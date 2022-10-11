import {
  getCountryHandler,
  getAllCountriesHandler,
} from '../controller/countries.controller';
import { Express } from 'express';
import validate from '../middleware/validateSchema';
import { getCountrySchema } from '../schema/country.schema';

const countryRoutes = (app: Express) => {
  /**
   * @openapi
   * /countries:
   *  get:
   *    tags:
   *      - Countries
   *    summary: Get all countries
   *    responses:
   *      200:
   *        description: A list of counries
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/CountryList'
   */
  app.get('/countries', getAllCountriesHandler);
  /**
   * @openapi
   * '/countries/{countryId}':
   *  get:
   *    tags:
   *      - Countries
   *    summary: Get a single country by countryId
   *    parameters:
   *      - name: countryId
   *        in: path
   *        description: the id of the country
   *        required: true
   *    responses:
   *      200:
   *        description: Success
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Country'
   *      404:
   *        description: Country not found
   *      400:
   *        description: Bad request
   */
  app.get(
    '/countries/:countryId',
    validate(getCountrySchema),
    getCountryHandler
  );
};

export default countryRoutes;
