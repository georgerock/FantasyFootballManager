import jwt, { JwtPayload } from 'jsonwebtoken';

const privateKey = process.env.PRIVATE_KEY;
const publicKey = process.env.PRIVATE_KEY;

export type JWTData = {
  valid: boolean;
  expired: boolean;
  data?: string | JwtPayload;
};

export function signJwt(object: Object, options?: jwt.SignOptions) {
  if (!privateKey) {
    throw new Error('Unable to serialize JWT. Private key not found in env');
  }
  return jwt.sign(object, privateKey, {
    ...(options && options),
    algorithm: 'RS256',
  });
}

export function verifyJwt(token: string): JWTData {
  if (!publicKey) {
    throw new Error('Unable to serialize JWT. Public key not found in env');
  }
  try {
    const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });

    return {
      valid: true,
      expired: false,
      data: decoded,
    };
  } catch (e: any) {
    console.error(e);
    return {
      valid: false,
      expired: e.message === 'jwt expired',
      data: undefined,
    };
  }
}
