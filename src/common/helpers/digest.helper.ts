import * as crypto from 'crypto';
import { IDigest } from '../interfaces/digest.interface';

export function calculateDigest(key: string, data: IDigest): string {
  const { order_number, amount, currency } = data;
  const rawData = `${key}${order_number}${amount}${currency}`;
  return crypto.createHash('sha512').update(rawData).digest('hex');
}
