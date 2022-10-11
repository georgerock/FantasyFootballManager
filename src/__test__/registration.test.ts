import createServer from '../util/server';
import supertest from 'supertest';
import * as UserService from '../service/user.service';
import { omit } from 'lodash';
import { hashSync } from '../util/hash';
import { signJwt, verifyJwt } from '../util/jwt';
import { JwtPayload } from 'jsonwebtoken';

const app = createServer(8000);

describe('authentication', () => {
  /*------------------------------ REGISTRATION ------------------------------*/
  describe('register user', () => {
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
  /*--------------------------------- LOGIN ----------------------------------*/
  describe('login', () => {
    const pass = 'secretPass123!@#';
    const hashedPass = hashSync(pass);

    const LoginInput = {
      email: 'john.doe@example.com',
      password: pass,
    };

    const DbUser = {
      id: 0,
      createdAt: Date.now().toString(),
      updateddAt: Date.now().toString(),
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: hashedPass,
    };

    describe('given a valid email and password', () => {
      it('should return valid tokens', async () => {
        const createUserServiceMock = jest
          .spyOn(UserService, 'getUserByEmail')
          // @ts-ignore
          .mockReturnValueOnce(DbUser);

        const {
          statusCode,
          body: { accessToken, refreshToken },
        } = await supertest(app).post('/login').send(LoginInput);

        expect(statusCode).toBe(200);
        expect(createUserServiceMock).toHaveBeenCalledWith(LoginInput.email);

        const aData = verifyJwt(accessToken);
        const rData = verifyJwt(refreshToken);

        expect(aData.expired).toBe(false);
        expect(rData.expired).toBe(false);

        expect(aData.valid).toBe(true);
        expect(rData.valid).toBe(true);

        const aUser = aData.data! as JwtPayload;
        const rUser = aData.data! as JwtPayload;

        expect(omit(aUser, ['iat', 'exp'])).toEqual(
          omit(DbUser, ['password', 'createdAt', 'updatedAt'])
        );
        expect(omit(rUser, ['iat', 'exp'])).toEqual(
          omit(DbUser, ['password', 'createdAt', 'updatedAt'])
        );
      });
    }),
      describe('given no request body', () => {
        it('should return an error', async () => {
          await supertest(app).post('/login').expect(400);
        });
      }),
      describe('given an invalid email', () => {
        it('should return invalid email error', async () => {
          const createUserServiceMock = jest
            .spyOn(UserService, 'getUserByEmail')
            // @ts-ignore
            .mockReturnValueOnce(DbUser);

          const { statusCode, body } = await supertest(app)
            .post('/login')
            .send({ ...LoginInput, email: 'invalid' });

          expect(statusCode).toBe(400);
          expect(body[0].message).toBe('Invalid email address');
          expect(createUserServiceMock).not.toHaveBeenCalled();
        });
      }),
      describe('given a non registered email', () => {
        it('should return invalid credentials error', async () => {
          const createUserServiceMock = jest
            .spyOn(UserService, 'getUserByEmail')
            // @ts-ignore
            .mockReturnValueOnce(null);

          const invalidEmail = 'nonexistent@test.com';
          const { statusCode, body } = await supertest(app)
            .post('/login')
            .send({ ...LoginInput, email: invalidEmail });

          expect(statusCode).toBe(401);
          expect(body[0].message).toBe('Invalid credentials');
          expect(createUserServiceMock).toHaveBeenCalledWith(invalidEmail);
        });
      }),
      describe('given a wrong password', () => {
        it('should return invalid credentials error', async () => {
          const createUserServiceMock = jest
            .spyOn(UserService, 'getUserByEmail')
            // @ts-ignore
            .mockReturnValueOnce(null);

          const invalidPass = 'sorrywrongpass';
          const { statusCode, body } = await supertest(app)
            .post('/login')
            .send({ ...LoginInput, password: invalidPass });

          expect(statusCode).toBe(401);
          expect(body[0].message).toBe('Invalid credentials');
          expect(createUserServiceMock).toHaveBeenCalledWith(LoginInput.email);
        });
      });
  });
});
