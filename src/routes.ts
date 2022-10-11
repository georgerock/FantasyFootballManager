import {
  loginHandler,
  registerUserHandler,
} from './controller/authentication.controller';
import { Express } from 'express';
import validate from './middleware/validateSchema';
import { registerUserSchema } from './schema/user.schema';
import { loginSchema } from './schema/login.schema';

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

  /**
   * @openapi
   * /login:
   *  post:
   *    tags:
   *      - Authentication
   *    summary: Login into an account
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/LoginInput'
   *    responses:
   *      200:
   *        description: Login Successful
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/TokenResponse'
   *      400:
   *        description: Bad Request
   *      401:
   *        description: Unauthorized
   */
  app.post('/login', validate(loginSchema), loginHandler);
};

export default routes;
