import { ConfigModule } from '@nestjs/config';
import * as crypto from 'crypto';

ConfigModule.forRoot();

const algorithm = 'aes-256-cbc';

// Convert environment variables to buffers
const secretKey = Buffer.from(
  process.env.ENCRYPTION_KEY.padEnd(32, '0').slice(0, 32),
  'utf8',
); // Ensure 32 bytes
const iv = Buffer.from(
  process.env.ENCRYPTION_IV.padEnd(16, '0').slice(0, 16),
  'utf8',
); // Ensure 16 bytes

if (secretKey.length !== 32 || iv.length !== 16) {
  throw new Error('Invalid key or IV length');
}

// Encrypt a token
export function encryptToken(token: string): string {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encrypted = cipher.update(token, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// Decrypt a token
export function decryptToken(encryptedToken: string): string {
  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
  let decrypted = decipher.update(encryptedToken, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
