/**
 * Query Builder Utilities for Raw SQL
 * Provides SQL string building helpers and pagination utilities
 */

import { PAGINATION } from '../constants';

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginationResult {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface SortOptions {
  field: string;
  order: 'asc' | 'desc';
}

/**
 * Normalize pagination parameters with validation
 */
export function normalizePagination(
  page?: number | string,
  limit?: number | string,
  maxLimit = PAGINATION.MAX_LIMIT,
  defaultLimit = PAGINATION.DEFAULT_LIMIT,
): PaginationOptions {
  const normalizedPage = page
    ? Math.max(1, Number.parseInt(String(page), 10) || 1)
    : PAGINATION.DEFAULT_PAGE;
  const normalizedLimit = limit
    ? Math.min(
        maxLimit,
        Math.max(1, Number.parseInt(String(limit), 10) || defaultLimit),
      )
    : defaultLimit;

  return {
    page: normalizedPage,
    limit: normalizedLimit,
  };
}

/**
 * Calculate pagination metadata
 */
export function calculatePagination(
  total: number,
  page: number,
  limit: number,
): PaginationResult {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

/**
 * Calculate offset from page and limit
 */
export function calculateOffset(page: number, limit: number): number {
  return (page - 1) * limit;
}

/**
 * Escape SQL identifier (table/column names)
 * Wraps identifier in square brackets for SQL Server
 */
export function escapeIdentifier(identifier: string): string {
  // Remove any existing brackets and wrap in new ones
  const cleaned = identifier.replace(/\[|\]/g, '');
  return `[${cleaned}]`;
}

/**
 * Escape SQL string value for LIKE queries
 * Escapes special characters used in SQL Server LIKE patterns
 */
export function escapeLikePattern(pattern: string): string {
  return pattern.replace(/%|_|\[|\]/g, (match) => `[${match}]`);
}

/**
 * Build LIKE search pattern with wildcards
 */
export function buildLikePattern(search: string): string {
  const escaped = escapeLikePattern(search.trim());
  return `%${escaped}%`;
}

/**
 * Build WHERE clause for text search (case-insensitive)
 * @param search Search term
 * @param columns Column names to search in
 * @returns SQL WHERE clause fragment
 */
export function buildSearchWhereClause(
  search: string | undefined,
  columns: string[],
): string {
  if (!search || search.trim().length === 0 || columns.length === 0) {
    return '';
  }

  const conditions = columns.map(
    (col) => `${escapeIdentifier(col)} LIKE @searchPattern COLLATE SQL_Latin1_General_CP1_CI_AS`,
  );

  return `(${conditions.join(' OR ')})`;
}

/**
 * Build WHERE clause for equality condition
 */
export function buildEqWhereClause(
  column: string,
  value: unknown,
  paramName?: string,
): string {
  const col = escapeIdentifier(column);
  const param = paramName || column;
  if (value === null) {
    return `${col} IS NULL`;
  }
  return `${col} = @${param}`;
}

/**
 * Build WHERE clause for IN condition
 */
export function buildInWhereClause(
  column: string,
  values: unknown[],
  paramName?: string,
): string {
  if (!values || values.length === 0) {
    return '1 = 0'; // Always false
  }

  const col = escapeIdentifier(column);
  const param = paramName || column;
  const placeholders = values.map((_, i) => `@${param}${i}`).join(', ');
  return `${col} IN (${placeholders})`;
}

/**
 * Build ORDER BY clause
 */
export function buildOrderByClause(
  field: string | undefined,
  order: 'asc' | 'desc' | undefined,
  defaultField: string,
  defaultOrder: 'asc' | 'desc' = 'asc',
  allowedFields?: string[],
): string {
  let sortField = defaultField;
  let sortOrder = defaultOrder;

  if (field && allowedFields && allowedFields.includes(field)) {
    sortField = field;
  }

  if (order === 'desc' || order === 'asc') {
    sortOrder = order;
  }

  return `ORDER BY ${escapeIdentifier(sortField)} ${sortOrder.toUpperCase()}`;
}

/**
 * Build pagination SQL (OFFSET/FETCH for SQL Server)
 */
export function buildPaginationClause(page: number, limit: number): string {
  const offset = calculateOffset(page, limit);
  return `OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`;
}

/**
 * Combine WHERE conditions with AND
 */
export function combineWhereConditions(
  ...conditions: (string | undefined)[]
): string {
  const validConditions = conditions.filter((c): c is string => !!c);
  if (validConditions.length === 0) {
    return '';
  }
  return validConditions.join(' AND ');
}

/**
 * Build date range WHERE clause
 */
export function buildDateRangeWhereClause(
  column: string,
  from?: Date | string,
  to?: Date | string,
): string {
  const conditions: string[] = [];
  const col = escapeIdentifier(column);

  if (from) {
    conditions.push(`${col} >= @dateFrom`);
  }

  if (to) {
    const toDate = typeof to === 'string' ? to : to.toISOString();
    // Add one day to include the entire end date
    const endDate = new Date(toDate);
    endDate.setDate(endDate.getDate() + 1);
    conditions.push(`${col} < @dateTo`);
  }

  return conditions.length > 0 ? conditions.join(' AND ') : '';
}
