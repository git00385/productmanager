export * from "./database";

/** Generic API response wrapper. */
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

/** Pagination params for list queries. */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/** Paginated response. */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/** Auth session user (subset of Supabase User). */
export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  plan: import("./database").Plan;
}

/** Nav item for sidebar. */
export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: string;
  disabled?: boolean;
}
