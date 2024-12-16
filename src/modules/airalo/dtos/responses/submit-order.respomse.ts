import { DataResponseDto } from './create-order.response.dto';

export class SubmitOrderResponseDto {
  status: 200 | 422 | 500; // HTTP status code
  message: string; // Success or error message
  data?: DataResponseDto; // Optional, for success responses
  error?: any; // Optional, for error details
}
