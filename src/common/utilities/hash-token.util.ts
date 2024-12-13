import { ConfigModule } from '@nestjs/config';
import * as crypto from 'crypto';
import { IResetPasswordToken } from 'src/modules/auth/interfaces/reset-password-token.interface';

ConfigModule.forRoot();

/**
 * Generates a random token string of a specified length.
 *
 * @param {number} length - The length of the random token. Defaults to 32.
 * @returns {string} A random hexadecimal token string.
 */
export function generateRandomToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Hashes a given token using a secret key set in the .env file.
 *
 * @param {string} token The token to hash.
 * @returns {string} The hashed token.
 */
export function hashToken(token: string): string {
  return crypto
    .createHmac('sha256', process.env.HASH_SECRET_KEY)
    .update(token)
    .digest('hex');
}

/**
 * Hashes a given token and sets an expiration time.
 *
 * @param {string} token - The token to hash.
 * @param {number} [timeExpireMinutes=60] - The expiration time in minutes. Defaults to 60 minutes.
 * @returns {IResetPasswordToken} An object containing the hashed token and its expiration date.
 */
export function hashTokenWithExpiry(
  token: string,
  timeExpireMinutes: number = 60,
): IResetPasswordToken {
  const tokenHash = hashToken(token);

  const timeExpireMilliseconds = timeExpireMinutes * 60 * 1000; // 1 hour=60×60×1000=3600000 milliseconds
  const expiresAt = new Date(Date.now() + timeExpireMilliseconds);
  return { tokenHash, expiresAt };
}
