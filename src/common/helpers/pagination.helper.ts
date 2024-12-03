import { PaginationQueryDto } from '../dtos/pagination.dto';

export function pageLimit(query: PaginationQueryDto, max?: number) {
  const page = query.page
    ? Number(query.page) < 1
      ? 1
      : Number(query.page)
    : 1;
  let limit = query.limit
    ? Number(query.limit) < 1
      ? 10
      : Number(query.limit)
    : 10;

  if (max && max < limit) limit = max;
  return {
    page,
    limit,
  };
}
