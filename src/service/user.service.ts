import prisma from '../util/client';
import { omit } from 'lodash';
import { UserData } from '../schema/user.schema';
import hash from '../util/hash';

export const createUser = async (usr: UserData) => {
  const { password } = usr;
  const hashedPass = await hash(password);
  const user = await prisma.user.create({
    data: { ...usr, password: hashedPass },
  });
  return omit(user, ['password']);
};

export const getUserByEmail = async (email: string) => {
  return await prisma.user.findFirst({
    where: { email },
    include: {
      team: {
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          name: true,
          value: true,
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

export const getUserById = async (id: number) => {
  return await prisma.user.findFirst({
    where: { id },
    include: {
      team: {
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          name: true,
          value: true,
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
