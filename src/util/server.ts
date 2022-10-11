import express, { Express } from 'express';
import swaggerDocs from '../util/swagger';
import routes from '../routes/routes';

const createServer = (port: number) => {
  const app: Express = express();
  app.use(express.json());
  routes(app);
  swaggerDocs(app, port);
  return app;
};

export default createServer;
