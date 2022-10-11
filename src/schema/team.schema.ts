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
 *          type:
 *            $ref: '#/components/schemas/SimpleCountry'
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

export const updateTeamSchema = object({
  ...payload,
  ...params,
});

export const getTeamSchema = object({
  ...params,
});

export type UpdateTeamSchema = TypeOf<typeof updateTeamSchema>;
export type GetTeamSchema = TypeOf<typeof updateTeamSchema>;
