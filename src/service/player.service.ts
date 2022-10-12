import prisma from '../util/client';
import {
  PlayerData,
  Position,
  UpdatePlayerSchema,
} from '../schema/player.schema';

export const createPlayer = async (data: PlayerData) => {
  return await prisma.player.create({ data: data });
};

export const findPlayersForTeam = async (teamId: number) => {
  return await prisma.player.findMany({
    where: { teamId },
    include: { country: { select: { id: true, iso: true, niceName: true } } },
  });
};

export const getPlayerOwnerId = async (playerId: number) => {
  const player = await prisma.player.findFirst({
    where: { id: playerId },
    include: { team: { include: { owner: { select: { id: true } } } } },
  });

  return player?.team.owner.id;
};

export const updatePlayer = async (
  id: number,
  { firstName, lastName, countryId }: UpdatePlayerSchema['body']
) => {
  return await prisma.player.update({
    data: { firstName, lastName, countryId },
    where: { id },
  });
};
