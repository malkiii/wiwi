import { env } from '~/env';
import jwt from 'jsonwebtoken';
import { compare, hash } from 'bcryptjs';

export function getHashedPassword(password: string) {
  return hash(password, 12);
}

export function isPasswordValid(password: string, hashedPassword: string) {
  return compare(password, hashedPassword);
}

export function generateVerificationToken(
  payload: Record<string, any>,
  callback: jwt.SignCallback,
) {
  return jwt.sign(payload, env.NEXTAUTH_SECRET, { expiresIn: '1d' }, callback);
}

export function verifyToken(token: string) {
  return jwt.verify(token, env.NEXTAUTH_SECRET);
}
