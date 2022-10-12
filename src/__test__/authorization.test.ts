import createServer from '../util/server';
import supertest from 'supertest';
import * as UserService from '../service/user.service';
import { signJwt } from '../util/jwt';
import { omit } from 'lodash';

const app = createServer(8000);

describe('authorization', () => {
  const userData = {
    id: 0,
    createdAt: Date.now().toString(),
    updatedAt: Date.now().toString(),
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@exmaple.com',
    password: 'secretPass123!@#',
    team: {
      id: 0,
      createdAt: Date.now().toString(),
      updatedAt: Date.now().toString(),
      name: "John's team",
      country: {
        id: 0,
        iso: 'AL',
        niceName: 'Albania',
      },
    },
  };

  const genHeader = (expire: boolean = false): string => {
    const expiryDate = expire ? '-1d' : '1d';
    const data = omit(userData, ['createdAt', 'updatedAt', 'password']);
    const token = signJwt(data, { expiresIn: expiryDate });
    return `Bearer ${token}`;
  };

  describe('given a valid auth token', () => {
    it('should return a proper response', async () => {
      const userServiceMock = jest
        .spyOn(UserService, 'getUserById')
        // @ts-ignore
        .mockReturnValueOnce(userData);
      const { statusCode, body } = await supertest(app)
        .get('/me')
        .set('Authorization', genHeader());

      expect(statusCode).toBe(200);
      expect(body).toEqual(omit(userData, 'password'));

      expect(userServiceMock).toHaveBeenCalledWith(userData.id);
      expect(userServiceMock).toHaveBeenCalledTimes(1);
    });
  }),
    describe('given an invalid auth token', () => {
      it('should return forbidden', async () => {
        const userServiceMock = jest
          .spyOn(UserService, 'getUserById')
          // @ts-ignore
          .mockReturnValueOnce(userData);
        const { statusCode } = await supertest(app)
          .get('/me')
          .set('Authorization', `${genHeader()}a`);

        expect(statusCode).toBe(403);
        expect(userServiceMock).not.toHaveBeenCalled();
      });
    }),
    describe('given an expired token', () => {
      it('should return token expired error', async () => {
        const userServiceMock = jest
          .spyOn(UserService, 'getUserById')
          // @ts-ignore
          .mockReturnValueOnce(userData);
        const { statusCode } = await supertest(app)
          .get('/me')
          .set('Authorization', genHeader(true));

        expect(statusCode).toBe(401);
        expect(userServiceMock).not.toHaveBeenCalled();
      });
    }),
    describe('given no token', () => {
      it('should return forbidden', async () => {
        const userServiceMock = jest
          .spyOn(UserService, 'getUserById')
          // @ts-ignore
          .mockReturnValueOnce(userData);
        const { statusCode } = await supertest(app).get('/me');

        expect(statusCode).toBe(403);
        expect(userServiceMock).not.toHaveBeenCalled();
      });
    });
});
