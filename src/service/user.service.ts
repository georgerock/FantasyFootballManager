import prisma from '../util/client';
import { omit } from 'lodash';
import { UserData } from 'schema/user.schema';
import { User } from '@prisma/client';

export const createUser = async (data: UserData) => {
  const user = await prisma.user.create({ data });
  return omit(user, ['password']);
};
