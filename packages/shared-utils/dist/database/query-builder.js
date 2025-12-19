"use strict";
/**
 * Query Builder Utilities for Raw SQL
 * Provides SQL string building helpers and pagination utilities
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizePagination = normalizePagination;
exports.calculatePagination = calculatePagination;
exports.calculateOffset = calculateOffset;
exports.escapeIdentifier = escapeIdentifier;
exports.escapeLikePattern = escapeLikePattern;
exports.buildLikePattern = buildLikePattern;
exports.buildSearchWhereClause = buildSearchWhereClause;
exports.buildEqWhereClause = buildEqWhereClause;
exports.buildInWhereClause = buildInWhereClause;
exports.buildOrderByClause = buildOrderByClause;
exports.buildPaginationClause = buildPaginationClause;
exports.combineWhereConditions = combineWhereConditions;
exports.buildDateRangeWhereClause = buildDateRangeWhereClause;
const constants_1 = require("../constants");
/**
 * Normalize pagination parameters with validation
 */
function normalizePagination(page, limit, maxLimit = constants_1.PAGINATION.MAX_LIMIT, defaultLimit = constants_1.PAGINATION.DEFAULT_LIMIT) {
    const normalizedPage = page
        ? Math.max(1, Number.parseInt(String(page), 10) || 1)
        : constants_1.PAGINATION.DEFAULT_PAGE;
    const normalizedLimit = limit
        ? Math.min(maxLimit, Math.max(1, Number.parseInt(String(limit), 10) || defaultLimit))
        : defaultLimit;
    return {
        page: normalizedPage,
        limit: normalizedLimit,
    };
}
/**
 * Calculate pagination metadata
 */
function calculatePagination(total, page, limit) {
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
function calculateOffset(page, limit) {
    return (page - 1) * limit;
}
/**
 * Escape SQL identifier (table/column names)
 * Wraps identifier in square brackets for SQL Server
 */
function escapeIdentifier(identifier) {
    // Remove any existing brackets and wrap in new ones
    const cleaned = identifier.replace(/\[|\]/g, '');
    return `[${cleaned}]`;
}
/**
 * Escape SQL string value for LIKE queries
 * Escapes special characters used in SQL Server LIKE patterns
 */
function escapeLikePattern(pattern) {
    return pattern.replace(/%|_|\[|\]/g, (match) => `[${match}]`);
}
/**
 * Build LIKE search pattern with wildcards
 */
function buildLikePattern(search) {
    const escaped = escapeLikePattern(search.trim());
    return `%${escaped}%`;
}
/**
 * Build WHERE clause for text search (case-insensitive)
 * @param search Search term
 * @param columns Column names to search in
 * @returns SQL WHERE clause fragment
 */
function buildSearchWhereClause(search, columns) {
    if (!search || search.trim().length === 0 || columns.length === 0) {
        return '';
    }
    const conditions = columns.map((col) => `${escapeIdentifier(col)} LIKE @searchPattern COLLATE SQL_Latin1_General_CP1_CI_AS`);
    return `(${conditions.join(' OR ')})`;
}
/**
 * Build WHERE clause for equality condition
 */
function buildEqWhereClause(column, value, paramName) {
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
function buildInWhereClause(column, values, paramName) {
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
function buildOrderByClause(field, order, defaultField, defaultOrder = 'asc', allowedFields) {
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
function buildPaginationClause(page, limit) {
    const offset = calculateOffset(page, limit);
    return `OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`;
}
/**
 * Combine WHERE conditions with AND
 */
function combineWhereConditions(...conditions) {
    const validConditions = conditions.filter((c) => !!c);
    if (validConditions.length === 0) {
        return '';
    }
    return validConditions.join(' AND ');
}
/**
 * Build date range WHERE clause
 */
function buildDateRangeWhereClause(column, from, to) {
    const conditions = [];
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
