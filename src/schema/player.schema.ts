import { number, object, string, TypeOf } from 'zod';

/**
 * @openapi
 * components:
 *  schemas:
 *    MyPlayersResponse:
 *      type: array
 *      items:
 *        $ref: '#/components/schemas/Player'
 *    Position:
 *      type: string
 *      enum:
 *        - attack
 *        - midfield
 *        - defense
 *        - goalkeeper
 *    Player:
 *      type: object
 *      properties:
 *        id:
 *          type: number
 *        createdAt:
 *          type: string
 *          format: date-time
 *        updatedAt:
 *          type: string
 *          format: date-time
 *        firstName:
 *          type: string
 *        lastName:
 *          type: string
 *        age:
 *          type: number
 *          minimum: 18
 *          maximim: 40
 *        position:
 *          $ref: '#/components/schemas/Position'
 *        value:
 *          type: number
 *        teamId:
 *          type: number
 *        countryId:
 *          type: number
 *        country:
 *          $ref: '#/components/schemas/SimpleCountry'
 *    UpdatePlayerInput:
 *      type: object
 *      properties:
 *        firstName:
 *          type: string
 *          default: John
 *        lastName:
 *          type: string
 *          default: Doe
 *        countryId:
 *          type: number
 *          defalt: 1
 */

export type Position = 'attack' | 'midfield' | 'defense' | 'goalkeeper';
export type PlayerData = {
  firstName: string;
  lastName: string;
  countryId: number;
  position: Position;
  age: number;
  teamId: number;
};

const payload = {
  body: object({
    firstName: string({
      required_error: 'firstName is required',
    }),
    lastName: string({
      required_error: 'lastName is required',
    }),
    countryId: number({
      required_error: 'countryId is required',
    }),
  }),
};

const params = {
  params: object({
    playerId: string({
      required_error: 'playerId is required',
    }),
  }),
};

export const updatePlayerSchema = object({
  ...payload,
  ...params,
});

export type UpdatePlayerSchema = TypeOf<typeof updatePlayerSchema>;
