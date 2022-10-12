import prisma from '../util/client';
import { PlayerData, Position } from '../schema/player.schema';

export const createPlayer = async (data: PlayerData) => {
  return await prisma.player.create({ data: data });
};
