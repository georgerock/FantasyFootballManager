import { Request, Response } from 'express';
import { LoginInput } from 'schema/login.schema';
import { compare } from '../util/hash';
import { RegisterUserInput } from '../schema/user.schema';
import { createUser, getUserByEmail } from '../service/user.service';
import { signJwt } from '../util/jwt';
import { omit } from 'lodash';

export const loginHandler = async (
  { body: { email, password } }: Request<{}, {}, LoginInput['body']>,
  res: Response
) => {
  const user = await getUserByEmail(email);
  if (!user) {
    return res.status(401).send([
      {
        code: '401',
        message: 'Invalid credentials',
        path: ['body', 'email'],
      },
    ]);
  }

  const validPass = await compare(password, user.password);
  if (!validPass) {
    return res.status(401).send([
      {
        code: '401',
        message: 'Invalid credentials',
        path: ['body', 'email'],
      },
    ]);
  }

  const aTtl = process.env.ACCESS_TOKEN_TTL;
  const accessTokenTtl = aTtl ? aTtl : '15m';
  const accessToken = signJwt(
    omit(user, ['password', 'createdAt', 'updatedAt']),
    {
      expiresIn: accessTokenTtl,
    }
  );

  const rTtl = process.env.ACCESS_TOKEN_TTL;
  const refreshTokenTtl = rTtl ? rTtl : '1y';
  const refreshToken = signJwt(
    omit(user, ['password', 'createdAt', 'updatedAt']),
    {
      expiresIn: refreshTokenTtl,
    }
  );

  return res.send({ refreshToken, accessToken });
};

export const registerUserHandler = async (
  { body }: Request<{}, {}, RegisterUserInput['body']>,
  res: Response
) => {
  try {
    const { firstName, lastName, email, password } = body;

    const user = await createUser({
      firstName,
      lastName,
      email,
      password,
    });

    return res.send(user);
  } catch (e: any) {
    if (e.code === 'P2002') {
      //prisma unique constraint violation
      return res.status(409).send([
        {
          code: '409',
          message: 'An account with this email address already exists',
          path: ['body', 'email'],
        },
      ]);
    }

    return res.status(500).send('Something went wrong');
  }
};
