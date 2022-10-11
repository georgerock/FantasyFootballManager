import { NextFunction, Request, Response } from 'express';
import { get } from 'lodash';
import { verifyJwt } from '../util/jwt';

const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = get(req, 'headers.authorization', '').replace(
    /^Bearer\s/,
    ''
  );

  if (!accessToken) {
    return next();
  }

  const { data, expired } = verifyJwt(accessToken);

  if (expired) {
    res.sendStatus(401);
  }

  if (data) {
    res.locals.user = data;
    return next();
  }
};

export default deserializeUser;
