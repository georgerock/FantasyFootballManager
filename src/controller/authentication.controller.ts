import { Request, Response } from 'express';
import { LoginInput } from 'schema/login.schema';
import { compare } from '../util/hash';
import { RegisterUserInput } from '../schema/user.schema';
import { createUser, getUserByEmail } from '../service/user.service';
import { signJwt, verifyJwt } from '../util/jwt';
import { omit } from 'lodash';
import { RefreshInput } from '../schema/refresh.schema';
import { JwtPayload } from 'jsonwebtoken';

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
        path: ['body', 'password'],
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

export const refreshHandler = (
  { body: { refreshToken } }: Request<{}, {}, RefreshInput['body']>,
  res: Response
) => {
  const unsigned = verifyJwt(refreshToken);
  if (unsigned.expired) {
    return res.status(401).send([
      {
        code: '401',
        message: 'Expired token',
        path: ['body', 'refreshToken'],
      },
    ]);
  }

  if (!unsigned.valid) {
    return res.status(498).send([
      {
        code: '498',
        message: 'Invalid token',
        path: ['body', 'refreshToken'],
      },
    ]);
  }

  const unsignedData = unsigned.data! as JwtPayload;
  const data = omit(unsignedData, ['iat', 'exp']);

  const aTtl = process.env.ACCESS_TOKEN_TTL;
  const accessTokenTtl = aTtl ? aTtl : '15m';
  const at = signJwt(data, {
    expiresIn: accessTokenTtl,
  });

  const rTtl = process.env.ACCESS_TOKEN_TTL;
  const refreshTokenTtl = rTtl ? rTtl : '1y';
  const rt = signJwt(data, {
    expiresIn: refreshTokenTtl,
  });

  const tokens = { accessToken: at, refreshToken: rt };
  return res.send(tokens);
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
