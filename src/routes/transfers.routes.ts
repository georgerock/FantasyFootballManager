import {
  buyPlayerHandler,
  createTransferHandler,
  getTransfersHandler,
} from '../controller/transfers.controller';
import { Express } from 'express';
import requireUser from '../middleware/requireUser';
import validate from '../middleware/validateSchema';
import {
  buyPlayerSchema,
  createTransferSchema,
} from '../schema/transfers.schema';

const transferRoutes = (app: Express) => {
  /**
   * @openapi
   * /transfers:
   *  get:
   *    tags:
   *      - Transfers
   *    summary: Get a list of active transfers
   *    security:
   *      - bearerAuth: []
   *    responses:
   *      200:
   *        description: Transfers
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/TransferList'
   *      401:
   *        description: Unauthorized, check if accessToken expired
   *      403:
   *        description: Forbidden, check if accessToken is properly sent
   */
  app.get('/transfers', requireUser, getTransfersHandler);
  /**
   * @openapi
   * /transfers:
   *  post:
   *    tags:
   *      - Transfers
   *    summary: Put one of your players on the transfer list
   *    security:
   *      - bearerAuth: []
   *    responses:
   *      200:
   *        description: Player added to transfer list
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Transfer'
   *      401:
   *        description: Unauthorized, check if accessToken expired
   *      403:
   *        description: Forbidden, check if accessToken is properly sent
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/CreateTransferInput'
   */
  app.post(
    '/transfers/',
    [requireUser, validate(createTransferSchema)],
    createTransferHandler
  );
  /**
   * @openapi
   * '/transfers/{transferId}':
   *  post:
   *    tags:
   *      - Transfers
   *    summary: Buy a player listed on the transfer list
   *    security:
   *      - bearerAuth: []
   *    parameters:
   *      - name: transferId
   *        in: path
   *        description: the id of the transfer
   *        required: true
   *    responses:
   *      200:
   *        description: The newly bought player
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Player'
   *      404:
   *        description: Transfer not found
   *      403:
   *        description: Unauthorized
   *      400:
   *        description: Bad request
   */
  app.post(
    '/transfers/:transferId',
    [requireUser, validate(buyPlayerSchema)],
    buyPlayerHandler
  );
};

export default transferRoutes;
