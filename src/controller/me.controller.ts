import { Request, Response } from 'express';
import { omit } from 'lodash';
import { UpdateMyTeamSchema } from '../schema/team.schema';
import { createOrUpdateTeam } from '../service/team.service';
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

export const updateTeamHandler = async (
  { body: { countryId, name } }: Request<{}, {}, UpdateMyTeamSchema['body']>,
  res: Response
) => {
  try {
    const ownerId = res.locals.user.id;
    const team = await createOrUpdateTeam(ownerId, name, countryId);
    return res.send(team);
  } catch (e: any) {
    if (e.code === 'P2003') {
      return res.status(400).send([
        {
          code: '400',
          message: 'Invalid countryId',
          path: ['body', 'countryId'],
        },
      ]);
    }

    console.error(e);
  }
};
