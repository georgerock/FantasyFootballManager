import { Request, Response } from 'express';
import { getTeamForUser } from '../service/team.service';
import {
  BuyPlayerSchema,
  CreateTransferSchema,
} from '../schema/transfers.schema';
import { getPlayerOwnerId } from '../service/player.service';
import {
  closeTransfer,
  createTransfer,
  getActiveTransfers,
  getTransferById,
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

    if (askingPrice < 1) {
      return res.status(400).send([
        {
          code: '400',
          message: 'askingPrice must be a positive number',
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
export const buyPlayerHandler = async (
  { params: { transferId } }: Request<BuyPlayerSchema['params'], {}, {}>,
  res: Response
) => {
  const tId = parseInt(transferId, 10);
  if (isNaN(tId)) {
    return res.status(400).send([
      {
        code: '400',
        message: 'Invalid trasnferId',
        path: ['params', 'transferId'],
      },
    ]);
  }

  const me = res.locals.user.id;
  const transfer = await getTransferById(tId);
  const myTeam = await getTeamForUser(me);

  if (!myTeam) {
    return res.status(404).send([
      {
        code: '403',
        message: 'Forbidden',
        path: ['params', 'transferId'],
      },
    ]);
  }

  if (!transfer) {
    return res.status(404).send([
      {
        code: '404',
        message: 'Invalid trasnferId',
        path: ['params', 'transferId'],
      },
    ]);
  }

  const { destinationTeamId, originTeamId } = transfer;

  if (destinationTeamId) {
    return res.status(400).send([
      {
        code: '400',
        message: 'Can not buy from a transfer that already closed',
        path: ['params', 'transferId'],
      },
    ]);
  }

  if (originTeamId === myTeam.id) {
    return res.status(400).send([
      {
        code: '400',
        message: 'Can not buy your own player',
        path: ['params', 'transferId'],
      },
    ]);
  }

  if (myTeam.funds < transfer.askingPrice) {
    return res.status(400).send([
      {
        code: '400',
        message: 'Insufficient funds',
        path: ['params', 'transferId'],
      },
    ]);
  }

  const finished = await closeTransfer(transfer, myTeam.id);
  res.send(finished);
};
