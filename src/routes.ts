import { registerUserHandler } from './controller/authentication.controller';
import { Express } from 'express';
import validate from './middleware/validateSchema';
import { registerUserSchema } from './schema/user.schema';

const routes = (app: Express) => {
  /**
   * @openapi
   * /register:
   *  post:
   *    tags:
   *      - Authentication
   *    summary: Register an account
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/RegisterUserInput'
   *    responses:
   *      200:
   *        description: Registration successful
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/RegisterUserResponse'
   *      409:
   *        description: Conflict
   *      400:
   *        description: Bad Request
   */
  app.post('/register', validate(registerUserSchema), registerUserHandler);
};

export default routes;
