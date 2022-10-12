import { Request, Response } from 'express';
import { omit } from 'lodash';
import { findPlayersForTeam } from '../service/player.service';
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

export const getMyPlayersHandler = async (_req: Request, res: Response) => {
  const teamId: number = res.locals.user.team.id;
  const players = await findPlayersForTeam(teamId);
  return res.send(players);
};

export const updateTeamHandler = async (_req: Request, res: Response) => {};
