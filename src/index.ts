import express, { Express, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import swaggerDocs from './swagger';

dotenv.config();

const app: Express = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
const prisma = new PrismaClient();

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

/**
 * @openapi
 * /users:
 *  get:
 *    tags:
 *    - Users
 *    description: Returns all the users in the app
 *    responses:
 *      200:
 *        description: The app users
 */
app.get('/users', async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.send(users);
});

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
app.post('/register', async (req: Request, res: Response) => {
  res.send('you are registered, grats');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
  swaggerDocs(app, port);
});
