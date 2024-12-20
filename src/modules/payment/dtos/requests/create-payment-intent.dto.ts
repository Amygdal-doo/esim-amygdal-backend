import { IsNumber, IsString, IsNotEmpty, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentIntentDto {
  @ApiProperty({
    example: 1000,
    description: 'The chosem bundle',
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(50)
  bundleId: string;

  @ApiProperty({
    example: 'USD',
    description: 'Three-letter ISO currency code',
  })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({
    example: 'Buying 5$ credit bundle',
    examples: ['Buying 5$ credit bundle', 'Buying 10$ credit bundle'],
    description: 'A description of the payment',
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}
