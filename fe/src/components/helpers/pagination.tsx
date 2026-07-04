export interface PaginateResult<T> {
  paginatedData: T[];
  totalPages: number;
}

export function paginate<T>(
  data: T[],
  currentPage: number,
  itemsPerPage: number
): PaginateResult<T> {
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  return { paginatedData, totalPages };
}
