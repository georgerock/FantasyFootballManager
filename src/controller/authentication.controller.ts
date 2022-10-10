import { Request, Response } from 'express';
import { omit } from 'lodash';
import { RegisterUserInput } from '../schema/user.schema';
import { createUser } from '../service/user.service';

export const registerUserHandler = async (
  { body }: Request<{}, {}, RegisterUserInput['body']>,
  res: Response
) => {
  try {
    const { firstName, lastName, email, password } = body;
    const user = await createUser({ firstName, lastName, email, password });
    const mockReturn = {
      accessToken: 'asd',
      refreshToken: 'asd',
      userId: user.id,
    };
    return res.send(mockReturn);
  } catch (e: any) {
    console.error(e);
    return res.status(409).send(e.message);
  }
};
