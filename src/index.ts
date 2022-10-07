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

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
  swaggerDocs(app, port);
});
