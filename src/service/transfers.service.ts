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
export const closeTransfer = async () => {};
