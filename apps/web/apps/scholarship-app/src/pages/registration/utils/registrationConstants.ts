import { IStackTokens } from '@fluentui/react';
import { getThemeTokens, type ThemeTokens } from '@shared/config/theme';

/**
 * Common stack tokens used across registration steps
 */
export const STACK_TOKENS: IStackTokens = { childrenGap: 24 };
export const ROW_TOKENS: IStackTokens = { childrenGap: 24 };

/**
 * Common container class for step components
 */
export const STEP_CONTAINER_CLASS = "w-4/5 h-full flex flex-col [&_.ms-TextField-wrapper]:w-full text-[#242424] text=[20px]";

/**
 * Common title and subtitle styles as Tailwind classes
 */
export const STEP_TITLE_CLASS = "text-2xl font-semibold text-gray-900 mb-1";
export const STEP_SUBTITLE_CLASS = "text-sm text-gray-500 mb-8 text-[#707070] text-[12px]";

/**
 * Common field styles for Fluent UI components
 * Returns styles using theme tokens
 */
export const getFieldStyles = (tokens: ThemeTokens) => ({
    dropdown: { width: '100%' },
    title: { 
        height: 42, 
        lineHeight: 40, 
        borderRadius: parseInt(tokens.borderRadiusMedium), 
        borderColor: tokens.colorNeutralStroke1 
    },
    fieldGroup: { 
        height: 42, 
        borderRadius: parseInt(tokens.borderRadiusMedium), 
        borderColor: tokens.colorNeutralStroke1 ,
    }
});

// Legacy export for backward compatibility (deprecated - use getFieldStyles instead)
export const FIELD_STYLES = {
    dropdown: { width: '100%' },
    title: { height: 42, lineHeight: 40, borderRadius: 4, borderColor: '#d1d5db' },
    fieldGroup: { height: 42, borderRadius: 4, borderColor: '#d1d5db' }
};

/**
 * Common form field wrapper class
 */
export const FORM_FIELD_WRAPPER_CLASS = "min-w-[250px] ";

/**
 * Section header styles
 */
export const SECTION_HEADER_CLASS = "text-base font-semibold text-gray-900 mt-2 mb-4";

