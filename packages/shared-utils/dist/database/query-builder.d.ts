/**
 * Query Builder Utilities for Raw SQL
 * Provides SQL string building helpers and pagination utilities
 */
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
export declare function normalizePagination(page?: number | string, limit?: number | string, maxLimit?: 100, defaultLimit?: 20): PaginationOptions;
/**
 * Calculate pagination metadata
 */
export declare function calculatePagination(total: number, page: number, limit: number): PaginationResult;
/**
 * Calculate offset from page and limit
 */
export declare function calculateOffset(page: number, limit: number): number;
/**
 * Escape SQL identifier (table/column names)
 * Wraps identifier in square brackets for SQL Server
 */
export declare function escapeIdentifier(identifier: string): string;
/**
 * Escape SQL string value for LIKE queries
 * Escapes special characters used in SQL Server LIKE patterns
 */
export declare function escapeLikePattern(pattern: string): string;
/**
 * Build LIKE search pattern with wildcards
 */
export declare function buildLikePattern(search: string): string;
/**
 * Build WHERE clause for text search (case-insensitive)
 * @param search Search term
 * @param columns Column names to search in
 * @returns SQL WHERE clause fragment
 */
export declare function buildSearchWhereClause(search: string | undefined, columns: string[]): string;
/**
 * Build WHERE clause for equality condition
 */
export declare function buildEqWhereClause(column: string, value: unknown, paramName?: string): string;
/**
 * Build WHERE clause for IN condition
 */
export declare function buildInWhereClause(column: string, values: unknown[], paramName?: string): string;
/**
 * Build ORDER BY clause
 */
export declare function buildOrderByClause(field: string | undefined, order: 'asc' | 'desc' | undefined, defaultField: string, defaultOrder?: 'asc' | 'desc', allowedFields?: string[]): string;
/**
 * Build pagination SQL (OFFSET/FETCH for SQL Server)
 */
export declare function buildPaginationClause(page: number, limit: number): string;
/**
 * Combine WHERE conditions with AND
 */
export declare function combineWhereConditions(...conditions: (string | undefined)[]): string;
/**
 * Build date range WHERE clause
 */
export declare function buildDateRangeWhereClause(column: string, from?: Date | string, to?: Date | string): string;
