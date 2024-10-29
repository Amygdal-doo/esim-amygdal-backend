import { pbkdf2Sync, randomBytes } from 'crypto';

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex'); // Generate a salt
  const hash = pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex'); // Hash the password
  return `${salt}:${hash}`; // Combine salt and hash
}

export async function verifyPassword(
  storedPassword: string,
  inputPassword: string,
): Promise<boolean> {
  const [salt, originalHash] = storedPassword.split(':'); // Extract salt and hash

  const hash = pbkdf2Sync(inputPassword, salt, 100000, 64, 'sha512').toString(
    'hex',
  ); // Hash input password
  return hash === originalHash; // Compare hashes
}
