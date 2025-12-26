/**
 * Module to Screen ID Mapping
 * Maps BRD modules to actual Screen IDs from T_SCREENS table
 */
export const MODULE_TO_SCREEN_MAP: Record<string, number[]> = {
  'Overview': [1], // Home (Id: 1)
  'Documents (Upload)': [4], // Upload (Id: 4)
  'Upload': [4], // Upload (Id: 4) - alias
  'Verify': [8], // Verify (Id: 8)
  'Suggest': [2], // Suggest (Id: 2)
  'Approve': [3], // Approve (Id: 3)
  'Issue Amount': [6], // DDCheck (Id: 6)
  'Reports': [7], // Report (Id: 7)
  'User Management': [9], // User Management (Id: 9)
  'Role Management': [], // Not in T_SCREENS yet, will be added later
  'Print Approval Form': [10], // Print Approval Form (Id: 10)
  'Menu': [], // Not a screen, just a navigation item
};

/**
 * Get screen IDs for a module name
 */
export function getScreenIdsForModule(moduleName: string): number[] {
  return MODULE_TO_SCREEN_MAP[moduleName] || [];
}

/**
 * Get all screen IDs for multiple modules
 */
export function getScreenIdsForModules(moduleNames: string[]): number[] {
  const screenIds = new Set<number>();
  moduleNames.forEach(module => {
    getScreenIdsForModule(module).forEach(id => screenIds.add(id));
  });
  return Array.from(screenIds);
}

