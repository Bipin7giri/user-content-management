export interface PaginatedResponse<T> {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  totalPages: number;
  data: T[];
}
