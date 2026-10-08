import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hashed: string,
): Promise<boolean> {
  return bcrypt.compare(password, hashed);
}

export const DUMMY_HASH =
  "$2a$12$C6UzMDM.H6dfI/f/IKcEeO7ZBpQ0G1E5rN0a1P2q3s4t5u6v7w8x9";
