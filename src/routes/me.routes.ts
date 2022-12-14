import {
  getMyPlayersHandler,
  getMyTeamHandler,
  meHandler,
  updatePlayerHandler,
  updateTeamHandler,
} from '../controller/me.controller';
import { Express } from 'express';
import requireUser from '../middleware/requireUser';
import validate from '../middleware/validateSchema';
import { updateMyTeamSchema } from '../schema/team.schema';
import { updatePlayerSchema } from '../schema/player.schema';

const meRoutes = (app: Express) => {
  /**
   * @openapi
   * /me:
   *  get:
   *    tags:
   *      - Me
   *    summary: Get my account info
   *    security:
   *      - bearerAuth: []
   *    responses:
   *      200:
   *        description: Account info
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#components/schemas/MyAccount'
   *      401:
   *        description: Unauthorized, check if accessToken expired
   *      403:
   *        description: Forbidden, check if accessToken is properly sent
   */
  app.get('/me', requireUser, meHandler);
  /**
   * @openapi
   * /me/team:
   *  get:
   *    tags:
   *      - Me
   *    summary: Get my team info
   *    security:
   *      - bearerAuth: []
   *    responses:
   *      200:
   *        description: Account info
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#components/schemas/Team'
   *      401:
   *        description: Unauthorized, check if accessToken expired
   *      403:
   *        description: Forbidden, check if accessToken is properly sent
   */
  app.get('/me/team', requireUser, getMyTeamHandler);
  /**
   * @openapi
   * '/me/players':
   *  get:
   *    tags:
   *      - Me
   *    summary: Get a list of all my players
   *    security:
   *      - bearerAuth: []
   *    responses:
   *      200:
   *        description: Players
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/MyPlayersResponse'
   *      401:
   *        description: Unauthorized, check if accessToken expired
   *      403:
   *        description: Forbidden, check if accessToken is properly sent
   */
  app.get('/me/players', requireUser, getMyPlayersHandler);
  /**
   * @openapi
   * '/me/team':
   *  put:
   *    tags:
   *      - Me
   *    summary: Update your team's information
   *    security:
   *      - bearerAuth: []
   *    responses:
   *      200:
   *        description: Update successful
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#components/schemas/Team'
   *      401:
   *        description: Unauthorized, check if accessToken expired
   *      403:
   *        description: Forbidden, check if accessToken is properly sent
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/UpdateMyTeamInput'
   */
  app.put(
    '/me/team',
    [requireUser, validate(updateMyTeamSchema)],
    updateTeamHandler
  );

  /**
   * @openapi
   * '/me/players/{playerId}':
   *  put:
   *    tags:
   *      - Me
   *    summary: Update one of your players
   *    security:
   *      - bearerAuth: []
   *    parameters:
   *      - name: playerId
   *        in: path
   *        description: the id of the player
   *        required: true
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/UpdatePlayerInput'
   *    responses:
   *      200:
   *        description: Success
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Player'
   *      404:
   *        description: Player not found
   *      400:
   *        description: Bad request
   */
  app.put(
    '/me/players/:playerId',
    [requireUser, validate(updatePlayerSchema)],
    updatePlayerHandler
  );
};

export default meRoutes;
