import { Request, Response } from 'express';
import { omit } from 'lodash';
import { UpdateMyTeamSchema } from '../schema/team.schema';
import { createOrUpdateTeam } from '../service/team.service';
import {
  findPlayersForTeam,
  getPlayerOwnerId,
  updatePlayer,
} from '../service/player.service';
import { getUserById } from '../service/user.service';
import { UpdatePlayerSchema } from 'schema/player.schema';

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

export const updatePlayerHandler = async (
  {
    params,
    body,
  }: Request<UpdatePlayerSchema['params'], {}, UpdatePlayerSchema['body']>,
  res: Response
) => {
  try {
    const playerId = parseInt(params.playerId, 10);
    if (isNaN(playerId) || playerId < 0) {
      return res.status(400).send([
        {
          code: '400',
          message: 'Invalid playerId',
          path: ['params', 'playerId'],
        },
      ]);
    }

    const ownerId = await getPlayerOwnerId(playerId);

    if (!ownerId) {
      return res.status(404).send([
        {
          code: '404',
          message: 'Unable to find player with that id',
          path: ['params', 'playerId'],
        },
      ]);
    }

    const userId = res.locals.user.id;

    if (ownerId !== userId) {
      return res.status(403).send([
        {
          code: '403',
          message: "You are not this player's owner",
          path: ['params', 'playerId'],
        },
      ]);
    }

    const player = await updatePlayer(playerId, body);
    return res.send(player);
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
