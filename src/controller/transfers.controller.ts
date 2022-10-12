import { Request, Response } from 'express';
import { CreateTransferSchema } from '../schema/transfers.schema';
import { getPlayerOwnerId } from '../service/player.service';
import {
  createTransfer,
  getActiveTransfers,
} from '../service/transfers.service';

export const getTransfersHandler = async (req: Request, res: Response) => {
  const myTeam = res.locals.user.team.id;
  const transfers = await getActiveTransfers(myTeam);

  return res.send(transfers);
};
export const createTransferHandler = async (
  {
    body: { playerId, askingPrice },
  }: Request<{}, {}, CreateTransferSchema['body']>,
  res: Response
) => {
  try {
    const me = res.locals.user.id;
    const myTeam = res.locals.user.team.id;
    const playerOwner = await getPlayerOwnerId(playerId);

    if (playerOwner !== me) {
      return res.status(403).send([
        {
          code: '403',
          message: 'You are not allowed to sell players that are not yours',
          path: ['body', 'playerId'],
        },
      ]);
    }

    const transfer = await createTransfer(playerId, myTeam, askingPrice);
    return res.send(transfer);
  } catch (e: any) {
    if (e.code === 'P2003') {
      return res.status(400).send([
        {
          code: '400',
          message: 'Invalid playerId',
          path: ['body', 'playerId'],
        },
      ]);
    }

    console.error(e);
  }
};
export const buyPlayerHandler = async (req: Request, res: Response) => {};
