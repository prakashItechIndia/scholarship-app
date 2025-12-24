/**
 * Helper function to get a value from a database record case-insensitively
 * SQL Server can return column names in different cases (ISACTIVE, IsActive, etc.)
 */
export function getCaseInsensitiveValue<T = unknown>(
  record: Record<string, unknown>,
  fieldName: string,
): T | undefined {
  // Try exact match first
  if (fieldName in record) {
    return record[fieldName] as T;
  }

  // Try case-insensitive match
  const lowerFieldName = fieldName.toLowerCase();
  for (const key in record) {
    if (key.toLowerCase() === lowerFieldName) {
      return record[key] as T;
    }
  }

  return undefined;
}

/**
 * Helper function to convert a value to boolean, handling various formats
 * (true, 1, '1', 'true', etc.)
 */
export function toBoolean(value: unknown): boolean {
  return (
    value === true ||
    value === 1 ||
    String(value) === '1' ||
    String(value).toLowerCase() === 'true'
  );
}

