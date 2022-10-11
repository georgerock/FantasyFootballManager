import createServer from '../util/server';
import supertest from 'supertest';
import * as UserService from '../service/user.service';
import { omit } from 'lodash';
import hash from '../util/hash';

const app = createServer(8000);

const registrationInput = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'joh.doe@example.com',
  password: 'secretPass123!@#',
  passwordConfirmation: 'secretPass123!@#',
};

const registrationResponse = {
  id: 0,
  firstName: 'John',
  lastName: 'Doe',
  email: 'joh.doe@example.com',
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
    describe('given non matching passwords', () => {
      it('should return non matching passwords error', async () => {
        const createUserServiceMock = jest
          .spyOn(UserService, 'createUser')
          // @ts-ignore
          .mockReturnValueOnce(omit(userPayload, ['password']));

        const { statusCode, body } = await supertest(app)
          .post('/register')
          .send({ ...registrationInput, passwordConfirmation: 'not good' });

        expect(statusCode).toBe(400);
        expect(body[0].message).toBe('Passwords do not match');
        expect(createUserServiceMock).not.toHaveBeenCalled();
      });
    });
    describe('given invalid passwords', () => {
      it('should return invalid password error', async () => {
        const createUserServiceMock = jest
          .spyOn(UserService, 'createUser')
          // @ts-ignore
          .mockReturnValueOnce(omit(userPayload, ['password']));

        const { statusCode, body } = await supertest(app)
          .post('/register')
          .send({
            ...registrationInput,
            passwordConfirmation: 'short',
            password: 'short',
          });

        expect(statusCode).toBe(400);
        expect(body[0].message).toBe(
          'Password should be at least 8 characters long'
        );
        expect(createUserServiceMock).not.toHaveBeenCalled();
      });
    });
    describe('given an invalid email', () => {
      it('should return invalid email error', async () => {
        const createUserServiceMock = jest
          .spyOn(UserService, 'createUser')
          // @ts-ignore
          .mockReturnValueOnce(omit(userPayload, ['password']));

        const { statusCode, body } = await supertest(app)
          .post('/register')
          .send({
            ...registrationInput,
            email: 'badmail.com',
          });

        expect(statusCode).toBe(400);
        expect(body[0].message).toBe('Not a valid email');
        expect(createUserServiceMock).not.toHaveBeenCalled();
      });
    });
    describe("given a an email that's already registered", () => {
      it('should return a duplicate error', async () => {
        const error = new Error('Duplicate key violation');
        // @ts-ignore
        error.code = 'P2002';
        const createUserServiceMock = jest
          .spyOn(UserService, 'createUser')
          .mockRejectedValueOnce(error);

        const { statusCode, body } = await supertest(app)
          .post('/register')
          .send({
            ...registrationInput,
          });

        expect(statusCode).toBe(409);
        expect(body[0].message).toBe(
          'An account with this email address already exists'
        );
        expect(createUserServiceMock).toHaveBeenCalledWith(
          omit(registrationInput, ['passwordConfirmation'])
        );
      });
    });
  });
});
