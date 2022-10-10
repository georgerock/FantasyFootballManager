import { Request, Response } from 'express';
import { RegisterUserInput } from '../schema/user.schema';
import { createUser } from '../service/user.service';

export const registerUserHandler = async (
  req: Request<{}, {}, RegisterUserInput['body']>,
  res: Response
) => {
  try {
    const mockReturn = createUser(req);
    return res.send(mockReturn);
  } catch (e: any) {
    console.error(e);
    return res.status(409).send(e.message);
  }
};
