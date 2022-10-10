import express, { Express, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import swaggerDocs from './util/swagger';
import routes from './routes';

dotenv.config();

const app: Express = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;

app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running at https://localhost:${port}`);
  routes(app);
  swaggerDocs(app, port);
});
