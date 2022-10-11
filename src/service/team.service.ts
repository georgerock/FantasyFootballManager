import prisma from '../util/client';

export const getTeamForUser = async (userId: number) => {
  const team = await prisma.team.findFirst({
    where: { owner: { id: userId } },
  });
  return team;
};

export const createOrUpdateTeam = async (
  ownerId: number,
  name: string,
  countryId: number
) => {
  const team = await prisma.team.upsert({
    create: { name, ownerId, countryId },
    update: { name, countryId },
    where: { ownerId },
  });
  return team;
};
