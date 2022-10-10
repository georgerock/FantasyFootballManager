import createServer from '../util/server';
import supertest from 'supertest';
import * as UserService from '../service/user.service';
import { omit } from 'lodash';

const app = createServer(8000);

const registrationInput = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'joh.doe@example.com',
  password: 'secretPass123!@#',
  passwordConfirmation: 'secretPass123!@#',
};

const registrationResponse = {
  accessToken: 'asd',
  refreshToken: 'asd',
  userId: 0,
};

const userPayload = {
  id: 0,
  firstName: 'John',
  lastName: 'Doe',
  email: 'joh.doe@example.com',
  password: 'secretPass123!@#',
};

describe('authentication', () => {
  describe('register user', () => {
    describe('given an empty request body', () => {
      it('should return a 400 status', async () => {
        await supertest(app).post('/register').expect(400);
      });
    }),
      describe('given a valid input', () => {
        it('should return the user payload', async () => {
          const createUserServiceMock = jest
            .spyOn(UserService, 'createUser')
            // @ts-ignore
            .mockReturnValueOnce(omit(userPayload, ['password']));

          const { statusCode, body } = await supertest(app)
            .post('/register')
            .send(registrationInput);

          expect(statusCode).toBe(200);
          expect(body).toEqual(registrationResponse);
          expect(createUserServiceMock).toHaveBeenCalledWith(
            omit(registrationInput, ['passwordConfirmation'])
          );
        });
      });
  });
});
