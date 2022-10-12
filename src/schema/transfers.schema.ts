import { number, object, TypeOf } from 'zod';

/**
 * @openapi
 * components:
 *  schemas:
 *    Transfer:
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
 *        price:
 *          type: number
 *        player:
 *          $ref: '#/components/schemas/Player'
 *          nullable: true
 *    TransferList:
 *      type: array
 *      items:
 *        $ref: '#/components/schemas/Transfer'
 *    CreateTransferInput:
 *      type: object
 *      required:
 *        - playerId
 *        - askingPrice
 *      properties:
 *        playerId:
 *          type: number
 *          default: 0
 *        askingPrice:
 *          type: number
 *          default: 0
 */

export const createTransferSchema = object({
  body: object({
    playerId: number({
      required_error: 'playerId is required',
    }),
    askingPrice: number({
      required_error: 'askingprice is required',
    }),
  }),
});

const buyPlayerParams = {
  params: object({
    transferId: number({
      required_error: 'transferId is required',
    }),
  }),
};

export const buyPlayerSchema = object({
  ...buyPlayerParams,
});

export type CreateTransferSchema = TypeOf<typeof createTransferSchema>;
export type BuyPlayerSchema = TypeOf<typeof buyPlayerSchema>;
