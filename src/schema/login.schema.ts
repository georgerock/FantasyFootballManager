import { object, string, TypeOf } from 'zod';

/**
 * @openapi
 * components:
 *  schemas:
 *    LoginInput:
 *      type: object
 *      required:
 *        - email
 *        - password
 *      properties:
 *        email:
 *          type: string
 *          default: john.doe@example.com
 *        password:
 *          type: string
 *          default: secretPass123!@#
 *    TokenResponse:
 *      type: object
 *      properties:
 *        accessToken:
 *          type: string
 *        refreshToken:
 *          type: string
 */
export const loginSchema = object({
  body: object({
    email: string({
      required_error: 'Email field is required',
    }).email({
      message: 'Invalid email address',
    }),
    password: string({
      required_error: 'Password field is required',
    }),
  }),
});

export type LoginInput = TypeOf<typeof loginSchema>;

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};
