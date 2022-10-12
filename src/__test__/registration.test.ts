import createServer from '../util/server';
import supertest from 'supertest';
import * as UserService from '../service/user.service';
import * as TeamService from '../service/team.service';
import * as CountryService from '../service/country.service';
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

    const teamName = `${registrationInput.firstName}'s team`;

    const teamData = {
      id: 0,
      name: teamName,
      createdAt: Date.now().toString(),
      updatedAt: Date.now().toString(),
      countryId: 0,
      ownerId: 0,
    };

    const countryData = {
      id: 0,
      createdAt: Date.now().toString(),
      updatedAt: Date.now().toString(),
      name: 'ROMANIA',
      niceName: 'Romania',
      iso: 'RO',
      iso3: 'ROU',
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
          const createTeamServiceMock = jest
            .spyOn(TeamService, 'createOrUpdateTeam')
            // @ts-ignore
            .mockReturnValueOnce(teamData);
          const getCountryServiceMock = jest
            .spyOn(CountryService, 'defaultCountry')
            // @ts-ignore
            .mockReturnValueOnce(countryData);

          const { statusCode, body } = await supertest(app)
            .post('/register')
            .send(registrationInput);

          expect(statusCode).toBe(200);
          expect(body).toEqual(registrationResponse);

          expect(createTeamServiceMock).toHaveBeenCalledWith(
            registrationResponse.id,
            teamName,
            countryData.id
          );
          expect(createUserServiceMock).toHaveBeenCalledWith(
            omit(registrationInput, ['passwordConfirmation'])
          );

          expect(createUserServiceMock).toHaveBeenCalledTimes(1);
          expect(createTeamServiceMock).toHaveBeenCalledTimes(1);
          expect(getCountryServiceMock).toHaveBeenCalledTimes(1);
        });
      });
    describe('given non matching passwords', () => {
      it('should return non matching passwords error', async () => {
        const createUserServiceMock = jest
          .spyOn(UserService, 'createUser')
          // @ts-ignore
          .mockReturnValueOnce(omit(userPayload, ['password']));
        const createTeamServiceMock = jest
          .spyOn(TeamService, 'createOrUpdateTeam')
          // @ts-ignore
          .mockReturnValueOnce(teamData);
        const getCountryServiceMock = jest
          .spyOn(CountryService, 'defaultCountry')
          // @ts-ignore
          .mockReturnValueOnce(countryData);

        const { statusCode, body } = await supertest(app)
          .post('/register')
          .send({ ...registrationInput, passwordConfirmation: 'not good' });

        expect(statusCode).toBe(400);
        expect(body[0].message).toBe('Passwords do not match');
        expect(createUserServiceMock).not.toHaveBeenCalled();
        expect(createTeamServiceMock).not.toHaveBeenCalled();
        expect(getCountryServiceMock).not.toHaveBeenCalled();
      });
    });
    describe('given invalid passwords', () => {
      it('should return invalid password error', async () => {
        const createUserServiceMock = jest
          .spyOn(UserService, 'createUser')
          // @ts-ignore
          .mockReturnValueOnce(omit(userPayload, ['password']));
        const createTeamServiceMock = jest
          .spyOn(TeamService, 'createOrUpdateTeam')
          // @ts-ignore
          .mockReturnValueOnce(teamData);
        const getCountryServiceMock = jest
          .spyOn(CountryService, 'defaultCountry')
          // @ts-ignore
          .mockReturnValueOnce(countryData);

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
        expect(createTeamServiceMock).not.toHaveBeenCalled();
        expect(getCountryServiceMock).not.toHaveBeenCalled();
      });
    });
    describe('given an invalid email', () => {
      it('should return invalid email error', async () => {
        const createUserServiceMock = jest
          .spyOn(UserService, 'createUser')
          // @ts-ignore
          .mockReturnValueOnce(omit(userPayload, ['password']));
        const createTeamServiceMock = jest
          .spyOn(TeamService, 'createOrUpdateTeam')
          // @ts-ignore
          .mockReturnValueOnce(teamData);
        const getCountryServiceMock = jest
          .spyOn(CountryService, 'defaultCountry')
          // @ts-ignore
          .mockReturnValueOnce(countryData);

        const { statusCode, body } = await supertest(app)
          .post('/register')
          .send({
            ...registrationInput,
            email: 'badmail.com',
          });

        expect(statusCode).toBe(400);
        expect(body[0].message).toBe('Not a valid email');
        expect(createUserServiceMock).not.toHaveBeenCalled();
        expect(createTeamServiceMock).not.toHaveBeenCalled();
        expect(getCountryServiceMock).not.toHaveBeenCalled();
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
        const createTeamServiceMock = jest
          .spyOn(TeamService, 'createOrUpdateTeam')
          // @ts-ignore
          .mockReturnValueOnce(teamData);
        const getCountryServiceMock = jest
          .spyOn(CountryService, 'defaultCountry')
          // @ts-ignore
          .mockReturnValueOnce(countryData);

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
        expect(createTeamServiceMock).not.toHaveBeenCalled();
        expect(getCountryServiceMock).not.toHaveBeenCalled();
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

        expect(accessToken).not.toBe(refreshToken);

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
  /*---------------------------- REFRESH_TOKENS ------------------------------*/
  describe('refresh tokens', () => {
    const userObject = {
      id: 0,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
    };

    const rTtl = process.env.ACCESS_TOKEN_TTL;
    const refreshTokenTtl = rTtl ? rTtl : '1y';
    const oldToken = signJwt(userObject, {
      expiresIn: refreshTokenTtl,
    });

    const RefreshInput = { refreshToken: oldToken };

    describe('given a valid refresh token', () => {
      it('should return a new valid token pair', async () => {
        const {
          statusCode,
          body: { accessToken, refreshToken },
        } = await supertest(app).post('/refresh').send(RefreshInput);

        expect(statusCode).toBe(200);
        expect(accessToken).not.toBe(refreshToken);

        const aData = verifyJwt(accessToken);
        const rData = verifyJwt(refreshToken);

        expect(aData.expired).toBe(false);
        expect(rData.expired).toBe(false);

        expect(aData.valid).toBe(true);
        expect(rData.valid).toBe(true);

        const aUser = aData.data! as JwtPayload;
        const rUser = aData.data! as JwtPayload;

        expect(omit(aUser, ['iat', 'exp'])).toEqual(userObject);
        expect(omit(rUser, ['iat', 'exp'])).toEqual(userObject);
      });
    }),
      describe('given a missing request body', () => {
        it('should return a bad request error', async () => {
          await supertest(app).post('/refresh').expect(400);
        });
      }),
      describe('given an expired token', () => {
        it('should return and expired token error', async () => {
          const expiredToken = signJwt(userObject, { expiresIn: '-1h' });
          const { statusCode, body } = await supertest(app)
            .post('/refresh')
            .send({ refreshToken: expiredToken });

          expect(statusCode).toBe(401);
          expect(body[0].message).toBe('Expired token');
        });
      }),
      describe('given an invalid token', () => {
        it('should return an invalid token error', async () => {
          const invalidToken = `${RefreshInput.refreshToken}sda`;
          const { statusCode, body } = await supertest(app)
            .post('/refresh')
            .send({ refreshToken: invalidToken });

          expect(statusCode).toBe(498);
          expect(body[0].message).toBe('Invalid token');
        });
      });
  });
});
