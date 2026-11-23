import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as userRepo from '../repositories/userRepo.js';
import { AppError } from '../utils/AppError.js';
import { getJwtSecret, getJwtExpiresIn, JWT_ALGORITHM } from '../config/jwt.js';

const SALT_ROUNDS = 10;

export async function signup({ email, password, name }) {
  if (await userRepo.findByEmail(email)) {
    throw new AppError(409, 'Email is already in use.');
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await userRepo.create({ email, password: hashedPassword, name });
  if (!user) {
    // Lost a race with a concurrent signup for the same email
    throw new AppError(409, 'Email is already in use.');
  }
  return user;
}

export async function login({ email, password }) {
  const user = await userRepo.findByEmail(email);
  const passwordMatches =
    user && (await bcrypt.compare(password, user.password));
  if (!passwordMatches) {
    throw new AppError(401, 'Invalid email or password.');
  }

  const accessToken = jwt.sign({ role: user.role }, getJwtSecret(), {
    algorithm: JWT_ALGORITHM,
    subject: String(user.id),
    expiresIn: getJwtExpiresIn(),
  });
  return { accessToken };
}