import { ThrottlerOptions } from '@nestjs/throttler';

export const rateLimitoptions: ThrottlerOptions = {
  ttl: 60 * 1000, // 60 sec
  limit: 30,
};
