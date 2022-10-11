import prisma from '../util/client';
import { omit } from 'lodash';
import { UserData } from 'schema/user.schema';
import hash from '../util/hash';

export const createUser = async (usr: UserData) => {
  const { password } = usr;
  const hashedPass = await hash(password);
  const user = await prisma.user.create({
    data: { ...usr, password: hashedPass },
  });
  return omit(user, ['password']);
};
