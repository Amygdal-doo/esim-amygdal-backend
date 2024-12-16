import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDateString,
  IsPositive,
} from 'class-validator';

export class MonriTransactionDto {
  @ApiProperty({
    description: 'Transaction ID assigned by Monri.',
    example: 881658,
  })
  @IsNumber()
  @IsPositive()
  id: number;

  @ApiProperty({
    description: 'The acquirer for the transaction.',
    example: 'xml-sim',
  })
  @IsString()
  @IsNotEmpty()
  acquirer: string;

  @ApiProperty({
    description: 'Unique order number for the transaction.',
    example: 'c3d4b8549794',
  })
  @IsString()
  @IsNotEmpty()
  order_number: string;

  @ApiProperty({
    description: 'Transaction amount in the smallest currency unit.',
    example: 100,
  })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({
    description: 'Currency of the transaction (ISO 4217 format).',
    example: 'USD',
  })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({
    description: 'Outgoing transaction amount.',
    example: 100,
  })
  @IsNumber()
  @IsPositive()
  outgoing_amount: number;

  @ApiProperty({
    description: 'Outgoing currency of the transaction.',
    example: 'USD',
  })
  @IsString()
  @IsNotEmpty()
  outgoing_currency: string;

  @ApiProperty({
    description: 'Approval code for the transaction.',
    example: '401295',
  })
  @IsString()
  @IsOptional()
  approval_code: string;

  @ApiProperty({
    description: 'Response code of the transaction.',
    example: '0000',
  })
  @IsString()
  @IsNotEmpty()
  response_code: string;

  @ApiProperty({
    description: 'Response message describing the transaction result.',
    example: 'transaction approved',
  })
  @IsString()
  @IsNotEmpty()
  response_message: string;

  @ApiProperty({
    description: 'Reference number for the transaction.',
    example: '841611',
  })
  @IsString()
  @IsNotEmpty()
  reference_number: string;

  @ApiProperty({
    description: 'System transaction ID (systan).',
    example: '881658',
  })
  @IsString()
  @IsNotEmpty()
  systan: string;

  @ApiProperty({
    description: 'Electronic Commerce Indicator (ECI) for the transaction.',
    example: '01',
  })
  @IsString()
  @IsOptional()
  eci: string;

  @ApiProperty({
    description: 'Extended transaction identifier (XID).',
    example: null,
  })
  @IsString()
  @IsOptional()
  xid: string | null;

  @ApiProperty({
    description: 'Additional Card Security Verification (ACSV).',
    example: null,
  })
  @IsString()
  @IsOptional()
  acsv: string | null;

  @ApiProperty({
    description: 'Credit card type used for the transaction.',
    example: 'master',
  })
  @IsString()
  @IsNotEmpty()
  cc_type: string;

  @ApiProperty({
    description: 'Transaction status.',
    example: 'approved',
  })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({
    description: 'Timestamp of the transaction creation.',
    example: '2024-12-10T11:41:31+01:00',
  })
  @IsDateString()
  created_at: string;

  @ApiProperty({
    description: 'Type of the transaction.',
    example: 'purchase',
  })
  @IsString()
  @IsNotEmpty()
  transaction_type: string;

  @ApiProperty({
    description: 'Enrollment status.',
    example: 'N',
  })
  @IsString()
  @IsOptional()
  enrollment: string;

  @ApiProperty({
    description: 'Authentication details (if available).',
    example: null,
  })
  @IsString()
  @IsOptional()
  authentication: string | null;

  @ApiProperty({
    description: 'PAN token if tokenization was applied.',
    example: null,
  })
  @IsString()
  @IsOptional()
  pan_token: string | null;

  @ApiProperty({
    description: 'Issuer type (on-us/off-us).',
    example: 'off-us',
  })
  @IsString()
  @IsOptional()
  issuer: string;

  @ApiProperty({
    description: 'Full name of the cardholder.',
    example: 'Test',
  })
  @IsString()
  @IsOptional()
  ch_full_name: string;

  @ApiProperty({
    description: 'Language of the transaction.',
    example: 'en',
  })
  @IsString()
  @IsNotEmpty()
  language: string;

  @ApiProperty({
    description: 'Masked version of the card PAN.',
    example: '546400-xxx-xxx-0008',
  })
  @IsString()
  @IsNotEmpty()
  masked_pan: string;

  @ApiProperty({
    description: 'Number of installments for the transaction (if applicable).',
    example: null,
  })
  @IsString()
  @IsOptional()
  number_of_installments: string | null;

  @ApiProperty({
    description: 'Custom parameters associated with the transaction.',
    example: '',
  })
  @IsString()
  @IsOptional()
  custom_params: string;
}

export class TransactionDto {
  @ApiProperty({
    description: 'Transaction response.',
    type: MonriTransactionDto,
  })
  @Type(() => MonriTransactionDto)
  //   @Transform(({ value }) => JSON.parse(value))
  transaction_response: MonriTransactionDto;
}
