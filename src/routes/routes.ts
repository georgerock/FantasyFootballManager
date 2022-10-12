import { Express } from 'express';
import authorizationRoutes from './authentication.routes';
import countryRoutes from './countries.routes';
import meRoutes from './me.routes';
import transferRoutes from './transfers.routes';

const routes = (app: Express) => {
  authorizationRoutes(app);
  countryRoutes(app);
  meRoutes(app);
  transferRoutes(app);
};

export default routes;
