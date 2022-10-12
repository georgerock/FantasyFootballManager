import { number, object, string, TypeOf } from 'zod';

/**
 * @openapi
 * components:
 *  schemas:
 *    Team:
 *      type: object
 *      required:
 *        - name
 *        - countryId
 *      properties:
 *        id:
 *          type: number
 *        createdAt:
 *          type: string
 *          format: date-time
 *        updatedAt:
 *          type: string
 *          format: date-time
 *        name:
 *          type: string
 *        country:
 *          $ref: '#/components/schemas/SimpleCountry'
 *    UpdateMyTeamInput:
 *      type: object
 *      required:
 *        - name
 *        - countryId
 *      properties:
 *        name:
 *          type: string
 *          default: new name
 *        countryId:
 *          type: number
 *          default: 0
 */

const payload = {
  body: object({
    name: string({
      required_error: 'Team name is required',
    }),
    countryId: number({
      required_error: 'Country id is required',
    }).gte(0),
  }),
};

const params = {
  params: object({
    teamId: string({
      required_error: 'teamId is required',
    }),
  }),
};

export const updateMyTeamSchema = object({
  ...payload,
});

export const getTeamSchema = object({
  ...params,
});

export type UpdateMyTeamSchema = TypeOf<typeof updateMyTeamSchema>;
export type GetTeamSchema = TypeOf<typeof getTeamSchema>;
