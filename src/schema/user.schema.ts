import { object, string, TypeOf } from 'zod';

/**
 * @openapi
 * components:
 *  schemas:
 *    RegisterUserResponse:
 *      type: object
 *      properties:
 *        id:
 *          type: number
 *        createdAt:
 *          type: string
 *          format: date-time
 *        updatedAt:
 *          type: string
 *          format: date-time
 *        firstName:
 *          type: string
 *        lastName:
 *          type: string
 *        email:
 *          type: string
 *          format: email
 *    RegisterUserInput:
 *      type: object
 *      required:
 *        - email
 *        - firstName
 *        - lastName
 *        - password
 *        - passwordConfirmation
 *      properties:
 *        email:
 *          type: string
 *          format: email
 *          default: john.doe@example.com
 *        firstName:
 *          type: string
 *          default: John
 *        lastName:
 *          type: string
 *          default: Doe
 *        password:
 *          type: string
 *          default: secretPass123!@#
 *          minLength: 8
 *          format: password
 *        passwordConfirmation:
 *          type: string
 *          default: secretPass123!@#
 *          minLength: 8
 *          format: password
 */

export const registerUserSchema = object({
  body: object({
    firstName: string({
      required_error: 'First name is required',
    }),
    lastName: string({
      required_error: 'Last name is required',
    }),
    email: string({
      required_error: 'Email is required',
    }).email('Not a valid email'),
    password: string({
      required_error: 'Password is required',
    }).min(8, 'Password should be at least 8 characters long'),
    passwordConfirmation: string({
      required_error: 'Password confirmation is required',
    }),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation'],
  }),
});

export type RegisterUserInput = Omit<
  TypeOf<typeof registerUserSchema>,
  'body.passwordConfirmation'
>;

export type UserData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};
