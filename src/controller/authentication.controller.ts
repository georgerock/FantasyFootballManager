import { Request, Response } from 'express';
import { LoginInput } from 'schema/login.schema';
import { compare } from '../util/hash';
import { RegisterUserInput } from '../schema/user.schema';
import { createUser, getUserByEmail } from '../service/user.service';
import { signJwt, verifyJwt } from '../util/jwt';
import { omit } from 'lodash';
import { RefreshInput } from '../schema/refresh.schema';
import { JwtPayload } from 'jsonwebtoken';
import { defaultCountry } from '../service/country.service';
import { createOrUpdateTeam } from '../service/team.service';
import { Position } from '../schema/player.schema';
import { createPlayer } from '../service/player.service';
import { Config, names, uniqueNamesGenerator } from 'unique-names-generator';

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

  const rTtl = process.env.REFRESH_TOKEN_TTL;
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

  const rTtl = process.env.REFRESH_TOKEN_TTL;
  const refreshTokenTtl = rTtl ? rTtl : '1y';
  const rt = signJwt(data, {
    expiresIn: refreshTokenTtl,
  });

  const tokens = { accessToken: at, refreshToken: rt };
  return res.send(tokens);
};

const generatePlayers = async (countryId: number, teamId: number) => {
  const [att, mid, def, goal] = [5, 6, 6, 3]; // team composition
  const team: Position[] = [
    ...Array(att).fill('Attack'),
    ...Array(mid).fill('Midfield'),
    ...Array(def).fill('Defense'),
    ...Array(goal).fill('Goalkeeper'),
  ] as Position[];

  const min = parseInt(process.env.PLAYER_MIN_AGE || '18', 10);
  const max = parseInt(process.env.PLAYER_MAX_AGE || '40', 10);

  const nameConfig: Config = {
    dictionaries: [names, names],
    separator: ' ',
    length: 2,
  };

  team.forEach(async (position) => {
    const age = Math.floor(Math.random() * (max - min + 1) + min);
    const [firstName, lastName] = uniqueNamesGenerator(nameConfig).split(' ');

    await createPlayer({
      firstName,
      lastName,
      age,
      position,
      countryId,
      teamId,
    });
  });
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

    const teamName = `${firstName}'s team`;
    const country = await defaultCountry();

    const team = await createOrUpdateTeam(user.id, teamName, country!.id);
    await generatePlayers(country!.id, team.id);

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

    console.error(e);
    return res.status(500).send('Something went wrong');
  }
};
