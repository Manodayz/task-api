import prisma from '../config/db.js';
import { isUniqueViolation } from './dbErrors.js';

const publicSelect = { id: true, email: true, name: true, role: true };

export function findByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

export async function create({ email, password, name }) {
  try {
    return await prisma.user.create({
      data: { email, password, name },
      select: publicSelect,
    });
  } catch (error) {
    if (isUniqueViolation(error)) return null;
    throw error;
  }
}