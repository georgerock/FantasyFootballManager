import { Request, Response } from 'express';
import hash from '../util/hash';
import { RegisterUserInput } from '../schema/user.schema';
import { createUser } from '../service/user.service';

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
