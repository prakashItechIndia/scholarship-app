/**
 * Screen Name to Tab Mapping
 * Maps screen names from T_SCREENS table to process page tabs
 */
export const SCREEN_NAME_TO_TAB_MAP: Record<string, string> = {
  'Home': 'overview',
  'Upload': 'documents',
  'Verify': 'verify',
  'Suggest': 'suggest',
  'Approve': 'approve',
  'DDCheck': 'issue-amount', // Issue Amount tab
};

/**
 * Tab to Screen Name Mapping (reverse lookup)
 */
export const TAB_TO_SCREEN_NAME_MAP: Record<string, string> = {
  'overview': 'Home',
  'documents': 'Upload',
  'verify': 'Verify',
  'suggest': 'Suggest',
  'approve': 'Approve',
  'issue-amount': 'DDCheck',
};

/**
 * Get tab value from screen name
 */
export function getTabFromScreenName(screenName: string): string | undefined {
  return SCREEN_NAME_TO_TAB_MAP[screenName];
}

/**
 * Get screen name from tab value
 */
export function getScreenNameFromTab(tab: string): string | undefined {
  return TAB_TO_SCREEN_NAME_MAP[tab];
}

