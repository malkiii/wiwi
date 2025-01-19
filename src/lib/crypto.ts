import { env } from '~/env';
import jwt from 'jsonwebtoken';
import { compare, hash } from 'bcryptjs';

export function getHashedPassword(password: string) {
  return hash(password, 12);
}

export function isPasswordValid(password: string, hashedPassword: string) {
  return compare(password, hashedPassword);
}

export function generateToken(payload: Record<string, any>, options: jwt.SignOptions = {}) {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, env.AUTH_SECRET, options, (err, token) => {
      if (err || !token) return reject(err?.message ?? 'Token not found!');
      resolve(token);
    });
  });
}

export function verifyToken(token: string) {
  return jwt.verify(token, env.AUTH_SECRET);
}
