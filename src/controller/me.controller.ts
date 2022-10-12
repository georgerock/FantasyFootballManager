import { Request, Response } from 'express';
import { omit } from 'lodash';
import { getUserById } from '../service/user.service';

export const meHandler = async (_req: Request, res: Response) => {
  const userId: number = res.locals.user.id;
  const myAccount = await getUserById(userId);

  if (!myAccount && !myAccount!.team) {
    return res.sendStatus(404);
  }

  return res.send(omit(myAccount, 'password'));
};

export const getMyTeamHandler = async (_req: Request, res: Response) => {
  const userId: number = res.locals.user.id;
  const myAccount = await getUserById(userId);

  if (!myAccount && !myAccount!.team) {
    return res.sendStatus(404);
  }

  return res.send(myAccount!.team);
};

export const updateTeamHandler = async (_req: Request, res: Response) => {};
