// Base64 encoding function
export function encodeBase64(text: string): string {
  const key = process.env.ENCRYPTION_KEY || '';
  return Buffer.from(`${key}:${text}`).toString('base64');
}

// Base64 decoding function
export function decodeBase64(encodedText: string): string {
  const key = process.env.ENCRYPTION_KEY || '';
  const decodedBuffer = Buffer.from(encodedText, 'base64');
  const decodedText = decodedBuffer.toString('utf-8');
  const [storedKey, storedToken] = decodedText.split(':');

  if (storedKey !== key) {
    throw new Error('Decryption failed: invalid key.');
  }

  return storedToken;
}
