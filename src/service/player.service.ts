import prisma from '../util/client';
import { PlayerData, Position } from '../schema/player.schema';

export const createPlayer = async (data: PlayerData) => {
  return await prisma.player.create({ data: data });
};

export const findPlayersForTeam = async (teamId: number) => {
  return await prisma.player.findMany({
    where: { teamId },
    include: { country: { select: { id: true, iso: true, niceName: true } } },
  });
};
