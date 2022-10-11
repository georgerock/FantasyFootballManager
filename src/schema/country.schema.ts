import { number, object, string, TypeOf } from 'zod';

/**
 * @openapi
 * components:
 *   schemas:
 *     Country:
 *       type: object
 *       required:
 *         - name
 *         - niceName
 *         - iso
 *       properties:
 *         id:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         iso:
 *           type: string
 *           format: iso2
 *         iso3:
 *           type: string
 *           format: iso3
 *         name:
 *           type: string
 *         niceName:
 *           type: string
 *     CountryList:
 *       type: array
 *       items:
 *        type: object
 *        properties:
 *          id:
 *            type: number
 *          iso:
 *            type: string
 *            format: iso2
 *          niceName:
 *            type: string
 */
const countrySchema = {
  body: object({
    id: number().gte(0),
    iso: string(),
    iso3: string().optional(),
    name: string(),
    niceName: string(),
  }),
};

const params = {
  params: object({
    countryId: string({
      required_error: 'countryId is required',
    }),
  }),
};

export const getCountrySchema = object({
  ...params,
});

export type GetCountryInput = TypeOf<typeof getCountrySchema>;
