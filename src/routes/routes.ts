import { Express } from 'express';
import authorizationRoutes from './authentication.routes';
import countryRoutes from './countries.routes';
import meRoutes from './me.routes';

const routes = (app: Express) => {
  authorizationRoutes(app);
  countryRoutes(app);
  meRoutes(app);
};

export default routes;
