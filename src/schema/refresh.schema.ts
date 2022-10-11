import { object, string, TypeOf } from 'zod';

/**
 * @openapi
 * components:
 *  schemas:
 *    RefreshInput:
 *      type: object
 *      required:
 *        - refreshToken
 *      properties:
 *        refreshToken:
 *          type: jwt
 *          default: eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZmlyc3ROYW1lIjoiSm9obiIsImxhc3ROYW1lIjoiRG9lIiwiZW1haWwiOiJqb2huLmRvZUBleGFtcGxlLmNvbSIsImlhdCI6MTY2NTQ3ODc1NSwiZXhwIjoxNjY1NDc5NjU1fQ.c8lIKQWXhCZFmBGGXeJ2QhRcqLfAmWgugOYEHLJLFC6_JRDWPGYOJNMWV10d-wVBPuV8c9kxXi9QBHSzEjGcYbJXjbosBttdzlnrnM2GuSOLm0Ypgok7-PHAaKPOir9ZjPH8W2hzP6yXZFVFEsEq2dSsHnzuvMAcRD02dDL2XQE
 */
export const refreshSchema = object({
  body: object({
    refreshToken: string({
      required_error: 'refreshToken is required',
    }),
  }),
});

export type RefreshInput = TypeOf<typeof refreshSchema>;
