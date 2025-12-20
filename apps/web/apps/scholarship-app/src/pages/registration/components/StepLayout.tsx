import { Stack } from '@fluentui/react';
import { ReactNode } from 'react';
import { STEP_CONTAINER_CLASS, STEP_TITLE_CLASS, STEP_SUBTITLE_CLASS } from '../utils/registrationConstants';

interface StepLayoutProps {
    title: string;
    subtitle: string;
    children: ReactNode;
}

/**
 * Common layout component for registration steps
 * Provides consistent title, subtitle, and container styling
 */
export const StepLayout = ({ title, subtitle, children }: StepLayoutProps) => {
    return (
        <Stack className={STEP_CONTAINER_CLASS}>
            <Stack grow verticalAlign="start">
                <h2 className={STEP_TITLE_CLASS}>{title}</h2>
                <p className={STEP_SUBTITLE_CLASS}>{subtitle}</p>
                {children}
            </Stack>
        </Stack>
    );
};

