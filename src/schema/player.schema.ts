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
