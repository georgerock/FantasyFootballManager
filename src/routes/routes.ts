import { Express } from 'express';
import authorizationRoutes from './authentication.routes';
import countryRoutes from './countries.routes';

const routes = (app: Express) => {
  countryRoutes(app);
  authorizationRoutes(app);
};

export default routes;
