import { Player, Transfer } from '@prisma/client';
import prisma from '../util/client';

export const createTransfer = async (
  playerId: number,
  originTeamId: number,
  askingPrice: number
) => {
  return await prisma.transfer.create({
    data: {
      askingPrice,
      originTeamId,
      playerId,
    },
  });
};

export const getActiveTransfers = async (excludeId: number) => {
  return await prisma.transfer.findMany({
    where: {
      destinationTeamId: null,
      originTeamId: { not: excludeId },
    },
    include: {
      player: {
        include: {
          country: {
            select: {
              id: true,
              iso: true,
              niceName: true,
            },
          },
        },
      },
    },
  });
};

export const getTransferById = async (id: number) => {
  return await prisma.transfer.findFirst({
    where: {
      id,
    },
    include: {
      player: true,
    },
  });
};
export const closeTransfer = async (
  transfer: Transfer & { player: Player },
  newTeam: number
) => {
  const { askingPrice, id: transferId } = transfer;
  const { id: playerId, teamId: oldTeam, value: oldValue } = transfer.player;

  const relativeIncrease = Math.floor(Math.random() * (100 - 10 + 1) + 10);
  const priceIncrease = Math.floor((relativeIncrease / 100) * oldValue);
  const newValue = priceIncrease + oldValue;

  const [player] = await prisma.$transaction([
    prisma.player.update({
      where: { id: playerId },
      data: { value: newValue, teamId: newTeam },
    }),
    prisma.team.update({
      where: { id: newTeam },
      data: {
        value: { increment: newValue },
        funds: { decrement: askingPrice },
      },
    }),
    prisma.team.update({
      where: { id: oldTeam },
      data: {
        value: { decrement: oldValue },
        funds: { increment: askingPrice },
      },
    }),
    prisma.transfer.update({
      where: { id: transferId },
      data: { destinationTeamId: newTeam },
    }),
  ]);

  return player;
};
