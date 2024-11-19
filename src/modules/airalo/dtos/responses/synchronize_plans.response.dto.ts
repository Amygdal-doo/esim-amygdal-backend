import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

class ImageDto {
  @ApiProperty({ description: 'Image width', example: 132 })
  @Expose()
  width: number;

  @ApiProperty({ description: 'Image height', example: 99 })
  @Expose()
  height: number;

  @ApiProperty({
    description: 'Image URL',
    example:
      'https://cdn.airalo.com/images/16291958-0de3-4142-b1ba-d2bb0aeb689c.png',
  })
  @Expose()
  url: string;
}

class NetworkDto {
  @ApiProperty({ description: 'Network name', example: 'AT&T' })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'Network types',
    example: ['LTE'],
    isArray: true,
  })
  @Expose()
  types: string[];
}

class CoverageDto {
  @ApiProperty({ description: 'Coverage name', example: 'US' })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'List of networks in this coverage',
    type: [NetworkDto],
  })
  @Expose()
  networks: NetworkDto[];
}

class PackageDto {
  @ApiProperty({ description: 'Package ID', example: 'change-7days-1gb' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Package type', example: 'sim' })
  @Expose()
  type: string;

  @ApiProperty({ description: 'Price of the package', example: 4.5 })
  @Expose()
  price: number;

  @ApiProperty({ description: 'Data amount in MB', example: 1024 })
  @Expose()
  amount: number;

  @ApiProperty({ description: 'Validity in days', example: 7 })
  @Expose()
  day: number;

  @ApiProperty({
    description: 'Indicates if the package has unlimited data',
    example: false,
  })
  @Expose()
  is_unlimited: boolean;

  @ApiProperty({
    description: 'Title of the package',
    example: '1 GB - 7 Days',
  })
  @Expose()
  title: string;

  @ApiProperty({ description: 'Data description', example: '1 GB' })
  @Expose()
  data: string;

  @ApiProperty({
    description: 'Short information about the package',
    example: "This eSIM doesn't come with a phone number.",
  })
  @Expose()
  short_info: string;

  @ApiProperty({ description: 'Included voice minutes', example: 100 })
  @Expose()
  voice: number;

  @ApiProperty({ description: 'Included text messages', example: 100 })
  @Expose()
  text: number;
}

class OperatorDto {
  @ApiProperty({ description: 'Operator ID', example: 569 })
  @Expose()
  id: number;

  @ApiProperty({ description: 'Operator style', example: 'light' })
  @Expose()
  style: string;

  @ApiProperty({ description: 'Gradient start color', example: '#0f1b3f' })
  @Expose()
  gradient_start: string;

  @ApiProperty({ description: 'Gradient end color', example: '#194281' })
  @Expose()
  gradient_end: string;

  @ApiProperty({ description: 'Operator type', example: 'local' })
  @Expose()
  type: string;

  @ApiProperty({
    description: 'Indicates if the operator is prepaid',
    example: false,
  })
  @Expose()
  is_prepaid: boolean;

  @ApiProperty({ description: 'Operator title', example: 'Change' })
  @Expose()
  title: string;

  @ApiProperty({ description: 'eSIM type', example: 'Prepaid' })
  @Expose()
  esim_type: string;

  @ApiProperty({ description: 'APN type', example: 'automatic' })
  @Expose()
  apn_type: string;

  @ApiProperty({ description: 'APN value', example: 'wbdata' })
  @Expose()
  apn_value: string;

  @ApiProperty({
    description: 'Indicates if roaming is enabled',
    example: true,
  })
  @Expose()
  is_roaming: boolean;

  @ApiProperty({
    description: 'Information about the operator',
    example: ['Data-only eSIM.', 'Rechargeable online with no expiry.'],
    isArray: true,
  })
  @Expose()
  info: string[];

  @ApiProperty({ description: 'Operator image', type: ImageDto })
  @Expose()
  image: ImageDto;

  @ApiProperty({ description: 'Plan type', example: 'data' })
  @Expose()
  plan_type: string;

  @ApiProperty({ description: 'Activation policy', example: 'first-usage' })
  @Expose()
  activation_policy: string;

  @ApiProperty({ description: 'Indicates if KYC is required', example: false })
  @Expose()
  is_kyc_verify: boolean;

  @ApiProperty({
    description: 'Indicates if recharge is possible',
    example: true,
  })
  @Expose()
  rechargeability: boolean;

  @ApiProperty({
    description: 'Additional information',
    example: 'This eSIM is for travelers to the United States.',
  })
  @Expose()
  other_info: string;

  @ApiProperty({ description: 'List of coverages', type: [CoverageDto] })
  @Expose()
  coverages: CoverageDto[];

  @ApiProperty({ description: 'List of packages', type: [PackageDto] })
  @Expose()
  packages: PackageDto[];
}

export class CountryDto {
  @ApiProperty({ description: 'Country slug', example: 'united-states' })
  @Expose()
  slug: string;

  @ApiProperty({ description: 'Country code', example: 'US' })
  @Expose()
  country_code: string;

  @ApiProperty({ description: 'Country title', example: 'United States' })
  @Expose()
  title: string;

  @ApiProperty({ description: 'Country image', type: ImageDto })
  @Expose()
  image: ImageDto;

  @ApiProperty({ description: 'List of operators', type: [OperatorDto] })
  @Expose()
  operators: OperatorDto[];
}

class LinksDto {
  @ApiProperty({
    description: 'First page link',
    example: 'https://partners-api.airalo.com/v1/packages?page=1',
  })
  @Expose()
  first: string;

  @ApiProperty({
    description: 'Last page link',
    example: 'https://partners-api.airalo.com/v1/packages?page=8',
  })
  @Expose()
  last: string;

  @ApiProperty({ description: 'Previous page link', example: null })
  @Expose()
  prev: string | null;

  @ApiProperty({
    description: 'Next page link',
    example: 'https://partners-api.airalo.com/v1/packages?page=2',
  })
  @Expose()
  next: string;
}

class MetaDto {
  @ApiProperty({ description: 'Response message', example: 'success' })
  @Expose()
  message: string;

  @ApiProperty({ description: 'Current page number', example: 1 })
  @Expose()
  current_page: number;

  @ApiProperty({ description: 'Start of the range', example: 1 })
  @Expose()
  from: number;

  @ApiProperty({ description: 'Last page number', example: 8 })
  @Expose()
  last_page: number;

  @ApiProperty({
    description: 'Base path for pagination',
    example: 'https://partners-api.airalo.com/v1/packages',
  })
  @Expose()
  path: string;

  @ApiProperty({ description: 'Items per page', example: '25' })
  @Expose()
  per_page: string;

  @ApiProperty({ description: 'End of the range', example: 25 })
  @Expose()
  to: number;

  @ApiProperty({ description: 'Total items', example: 195 })
  @Expose()
  total: number;
}

export class SynchronizePlansResponseDto {
  @ApiProperty({ description: 'List of countries', type: [CountryDto] })
  @Expose()
  data: CountryDto[];

  @ApiProperty({ description: 'Pagination links', type: LinksDto })
  @Expose()
  links: LinksDto;

  @ApiProperty({ description: 'Pagination metadata', type: MetaDto })
  @Expose()
  meta: MetaDto;
}