import { Stack, Text, Image, mergeStyles, IStackStyles, ImageFit, Spinner, SpinnerSize } from '@fluentui/react';
import { RocketRegular } from '@fluentui/react-icons';
import { Button } from '@shared/components';
import { SEO } from '../../components/seo/SEO';
import { RegistrationProvider, useRegistration } from '@/contexts/RegistrationContext';
import IdentityDetails from './steps/IdentityDetails';
import PersonalDetails from './steps/PersonalDetails';
import FamilyDetails from './steps/FamilyDetails';
import BankDetails from './steps/BankDetails';
import DocumentsUpload from './steps/DocumentsUpload';
// import ReviewSubmit from './steps/ReviewSubmit';
import logo from '@shared/assets/icons/Logo.svg';
import background from '@shared/assets/icons/header-bg.png';
import checkmarkIcon from '@shared/assets/icons/Checkmark.svg';
import ReviewSubmit from './steps/ReviewSubmit';

interface Step {
  id: number;
  title: string;
  key: string;
}

const STEPS: Step[] = [
  { id: 1, title: 'Identity Details', key: 'identity' },
  { id: 2, title: 'Personal Details', key: 'personal' },
  { id: 3, title: 'Family details', key: 'family' },
  { id: 4, title: 'Bank details of Applicant', key: 'bank' },
  { id: 5, title: 'Documents Upload', key: 'documents' },
  { id: 6, title: 'Review & Submit', key: 'review' },
];

// --- Styles ---

const headerStyles: IStackStyles = {
  root: {
    position: 'relative',
    borderBottom: '1px solid var(--gray-200, #fafafa)', // gray-200
    width: '100%',
    height: '200px', // Fixed height for header
    minHeight: '200px', // Ensure minimum height
    maxHeight: '200px', // Ensure maximum height
    overflow: 'hidden',
    flexShrink: 0, // Prevent shrinking
  },
};

const backgroundImageStyles = mergeStyles({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundImage: `url(${background})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'repeat',
  zIndex: 1,
});

const headerContentStyles: IStackStyles = {
  root: {
    width: '100%',
    height: '100%', // Take full height of parent
    padding: '24px 40px', // py-6 px-10
    position: 'relative',
    zIndex: 10,
    overflow: 'hidden', // Prevent content overflow
    boxSizing: 'border-box', // Include padding in height calculation
  },
};

const overlayStyles = mergeStyles({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  // backgroundColor: 'rgba(245, 245, 250, 0.57)', // Light blue-gray overlay for banner
  // backdropFilter: 'blur(1px)',
  zIndex: 2,
});

const logoContainerStyles = mergeStyles({
  width: 120,
  height: 120,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  padding: 4,
});

const sidebarStyles: IStackStyles = {
  root: {
    width: 400, // w-64
    fontSize: 15,
    backgroundColor: 'var(--gray-50, #fafafa)', // gray-50
    padding: 32,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    height: '100%', // Full height of the parent container
    overflowY: 'auto', // Scroll if content overflows
  },
};

// --- Sub-components ---

const StepIndicator = ({ step, isActive, isCompleted }: { step: Step, isActive: boolean, isCompleted: boolean }) => {
  const isFinalStep = step.id === STEPS.length;
  
  return (
    <Stack horizontal tokens={{ childrenGap: 14 }} verticalAlign="start">
      {/* <div className="rounded-full flex-shrink-0 flex items-center justify-center p-0.5 border-4"> */}
        <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold border-2 transition-all mt-1 border-none ${
         isActive 
            ? 'bg-gray-900 text-white !border-none' 
            : isCompleted 
              ? 'bg-green-500 text-white border-green-500' 
              : isFinalStep
                ? 'bg-gray-100 border-none'
                : 'bg-transparent  !bg-[#EBEBEB]'
        }`} style={{ lineHeight: '32px' }} >
          <div>
            {isCompleted ? (
              <Image src={checkmarkIcon} alt="Completed" width={26} height={26} imageFit={ImageFit.contain} />
            ) : isFinalStep && !isActive ? (
              <RocketRegular className="font-bold text-gray-400" style={{ width: '18px', height: '18px', color: '#616161' }} />
            ) : (
              <div className="flex items-center justify-center">   
                <span className={`text-[12px] font-bold flex items-center justify-center w-6 h-6 rounded-full 
                  ${isActive ? 'text-white border-2 ' : 'text-[#616161] border-[#616161] border-2'}`}>{step.id}</span>
              </div>
            )}
          </div>
      </div>
      <Stack style={{ paddingTop: '2px', justifyContent: 'center' }}>
        <Text variant="small" className={`uppercase tracking-wider font-semibold mb-1 ${isFinalStep ? 'text-[#707070]' : 'text-[#707070]'}`} style={{ fontSize: '11px', lineHeight: '16px' }}>
          {isFinalStep ? 'FINAL' : `STEP ${step.id}`}
        </Text>
        <Text variant="large" className={`font-bold ${isActive ? 'text-[#242424]' : 'text-[#242424]'}`} style={{ lineHeight: '24px', fontSize: '16px' }}>
          {step.title}
        </Text>
      </Stack>
    </Stack>
  );
};

const RegistrationContent = () => {
  // Direct destructuring - TypeScript should infer types from the hook's return type
  const { currentStep, completedSteps, prevStep, isLoading, formData, previousButtonConfig } = useRegistration();
  
  // Check if documents step has minimum 3 files (step 5 is DocumentsUpload)
  const isDocumentsStepValid = currentStep === 5 
    ? (formData?.documents && Array.isArray(formData.documents) && formData.documents.length >= 3)
    : true;

  // Determine previous button state from config or defaults
  const isPreviousDisabled = previousButtonConfig?.disabled ?? (currentStep === 1);
  const previousButtonLabel = previousButtonConfig?.label ?? 'Previous';

  // Build dynamic className for previous button
  const getPreviousButtonClassName = (): string => {
    const baseClasses = 'h-10 text-[12px] font-semibold !rounded-lg';
    
    // If disabled, always use disabled styling (overrides custom colors)
    if (isPreviousDisabled) {
      // If custom className is provided, merge with disabled styles
      if (previousButtonConfig?.className) {
        const customClass = previousButtonConfig.className;
        // Check if disabled styles are already in the custom class
        const hasDisabledStyles = customClass.includes('opacity') || customClass.includes('cursor-not-allowed');
        return hasDisabledStyles 
          ? customClass 
          : `${customClass} opacity-50 cursor-not-allowed`;
      }
      // Default disabled styling
      return `${baseClasses} !bg-[#E0E0E0] !text-[#BDBDBD] opacity-50 cursor-not-allowed`;
    }

    // Normal (enabled) state
    // If custom className is provided, use it
    if (previousButtonConfig?.className) {
      return previousButtonConfig.className;
    }

    // Build className from bgColor and textColor if provided
    const bgColor = previousButtonConfig?.bgColor;
    const textColor = previousButtonConfig?.textColor;
    
    if (bgColor || textColor) {
      const bgClass = bgColor 
        ? (bgColor.startsWith('#') ? `!bg-[${bgColor}]` : (bgColor.startsWith('bg-') ? `!${bgColor}` : `!bg-${bgColor}`))
        : '';
      const textClass = textColor
        ? (textColor.startsWith('#') ? `!text-[${textColor}]` : (textColor.startsWith('text-') ? `!${textColor}` : `!text-${textColor}`))
        : '';
      
      return `${baseClasses} ${bgClass} ${textClass}`.trim().replace(/\s+/g, ' ');
    }

    // Default enabled styling
    return `${baseClasses} !text-[#000]`;
  };

  const handleCancel = () => {
    window.location.href = '/user-login';
  };

  const renderStepObject = () => {
    switch (currentStep) {
      case 1: return <IdentityDetails />;
      case 2: return <PersonalDetails />;
      case 3: return <FamilyDetails />;
      case 4: return <BankDetails />;
      case 5: return <DocumentsUpload />;
      case 6: return <ReviewSubmit />;
      default: return <IdentityDetails />;
    }
  };

  const progressPercentage = (completedSteps.length / STEPS.length) * 100;

  return (
    <>
      <SEO
        title="Leo Muthu Scholarship Application"
        description="Online Registration for Scholarship Assistance - Academic Year 2025-2026"
        url=" /registration"
      />
      <Stack className="h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">

        {/* Header - Fixed Height */}
        <Stack horizontal verticalAlign="center" styles={headerStyles} disableShrink>
          <div className={backgroundImageStyles}></div>
          <div className={overlayStyles}></div>
          <Stack horizontal horizontalAlign="space-between" verticalAlign="center" styles={headerContentStyles}>
            {/* Logo */}
            <Stack.Item disableShrink>
              <div className={logoContainerStyles}>
                <Image src={logo} alt="Leo Muthu Scholarship Logo" width="100%" height="100%" imageFit={ImageFit.contain} />
              </div>
            </Stack.Item>

            {/* Title */}
            <Stack.Item grow>
              <Stack horizontalAlign="center" tokens={{ childrenGap: 8 }} style={{ overflow: 'hidden', maxHeight: '100%' }}>
                <Text variant="xxLarge" className="text-[#242424] font-bold text-[28px] font-weight-600" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  Leo Muthu Scholarship Application
                </Text>
                <Text variant="large" className="!text-[#242424] !text-[16px] font-weight-600" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  Online Registration for Scholarship Assistance - Academic Year 2025-2026
                </Text>
                <Text variant="medium" className="!text-[#242424] !text-[14px] font-weight-400" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>  
                  Complete the form below to apply for our scholarship program
                </Text>
              </Stack>
            </Stack.Item>

            {/* Spacer */}
            <Stack.Item disableShrink>
              <div className="hidden lg:block w-[120px]"></div>
            </Stack.Item>
          </Stack>
        </Stack>

        {/* Main Body - Fills remaining height */}
        <Stack horizontal grow className="overflow-hidden w-full">

          {/* Sidebar - Fixed Width, Scrollable inside if needed */}
          <Stack styles={sidebarStyles} className="bg-gray-50 dark:bg-gray-800" disableShrink>
            <Stack tokens={{ childrenGap: 10 }} style={{ marginBottom: 32,marginLeft: '18px' }}>
              <Stack horizontal horizontalAlign="space-between" verticalAlign="center" style={{ marginBottom: 32 }}>
                <Stack style={{ marginBottom: 0 }}>
                  <Text variant="xLarge" className="font-bold text-[20px] mb-0" style={{ lineHeight: '36px' }}>
                    Online registration
                  </Text>
                  <Text variant="small" className="text-[#707070] text-sm mt-1" style={{ lineHeight: '16px' }}>Getting started</Text>
                </Stack>

                {/* Progress Circle - SVG Implementation */}
                <div className="relative w-[60px] h-[60px] flex items-center justify-center mr-[20px]" style={{ flexShrink: 0 }}>
                  <svg width="50" height="50" viewBox="0 0 72 72" className="rotate-[-90deg]">
                    {/* Track */}
                    <circle
                      cx="36" cy="36" r="32"
                      fill="white"
                      stroke="var(--blue-100, #dbeafe)"
                      strokeWidth="4"
                    />
                    {/* Progress Arc */}
                    <circle
                      cx="36" cy="36" r="32"
                      fill="none"
                      stroke="var(--blue-600, #2563eb)"
                      strokeWidth="4"
                      strokeDasharray={2 * Math.PI * 32}
                      strokeDashoffset={(2 * Math.PI * 32) * (1 - (progressPercentage / 100))}
                      strokeLinecap="round"
                      className="transition-[stroke-dashoffset] duration-500 ease-out"
                    />
                  </svg>
                  <div className="absolute text-gray-800 font-semibold text-[13px]" style={{ lineHeight: '20px' }}>
                    {completedSteps.length}/{STEPS.length}
                  </div>
                </div>
              </Stack>

              <Stack tokens={{ childrenGap: 24 }} style={{fontSize: '10px' }}>
                {STEPS.map(step => (
                  <StepIndicator
                    key={step.id}
                    step={step}
                    isActive={currentStep === step.id}
                    isCompleted={completedSteps.includes(step.id)}
                  />
                ))}
              </Stack>
            </Stack>
          </Stack>

          {/* Main Form Content Wrapper - Flex Container */}
          <Stack grow className="flex flex-col h-full bg-white rounded-tr-xl">

            {/* Scrollable Content Area */}
            <Stack grow className="overflow-y-auto py-10 px-10">
              <Stack style={{ marginBottom: 8 }}>
                <Text className="text-[#2453C3] text-[10px] uppercase tracking-wider mb-0" style={{ lineHeight: '12px', letterSpacing: '0.05em' }}>
                  STEP {currentStep}/{STEPS.length}
                </Text>
              </Stack>

              {renderStepObject()}
            </Stack>

            {/* Navigation Footer - Fixed at bottom of this column */}
            <Stack
              horizontal
              horizontalAlign="space-between"
              verticalAlign="center"
              className="py-6 px-10 border-t border-gray-200 bg-white z-10 shrink-0"
            >
              <Button
                // appearance="primary"
                onClick={handleCancel}
                style={{border:'1px solid #D1D1D1', height:'40px',borderRadius:'10px' }}
              >
                Cancel
              </Button>

              <Stack horizontal tokens={{ childrenGap: 16 }}>
                <Button
                  appearance="outline"
                  onClick={() => {
                    void prevStep();
                  }}
                  disabled={isPreviousDisabled}
                  className={getPreviousButtonClassName()}
                >
                  {previousButtonLabel}
                </Button>
                <Button
                  type="button"
                  appearance="primary"
                  disabled={isLoading || !isDocumentsStepValid}
                  className='!bg-[#2453C3] !text-white !rounded-lg'
                  onClick={() => {
                    const form = document.getElementById('current-step-form') as HTMLFormElement;
                    if (form) {
                      form.requestSubmit();
                    }
                  }}
                >
                  {isLoading ? (
                    <Stack horizontal tokens={{ childrenGap: 8 }} verticalAlign="center" horizontalAlign="center">
                      <Spinner size={SpinnerSize.small} />
                      <span>Loading...</span>
                    </Stack>
                  ) : (
                    currentStep === 6 ? 'Submit' : 'Next'
                  )}
                </Button>
              </Stack>
            </Stack>

          </Stack>

        </Stack>

      </Stack>
    </>
  );
};

export default function RegistrationForm() {
  return (
    <RegistrationProvider>
      <RegistrationContent />
    </RegistrationProvider>
  );
};
