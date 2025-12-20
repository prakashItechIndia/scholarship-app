import { Stack, Text, Image, mergeStyles, IStackStyles, ImageFit, Spinner, SpinnerSize } from '@fluentui/react';
import { Button } from '@shared/components';
import { SEO } from '../../components/seo/SEO';
import { RegistrationProvider, useRegistration } from '@/contexts/RegistrationContext';
import IdentityDetails from './steps/IdentityDetails';
import PersonalDetails from './steps/PersonalDetails';
import FamilyDetails from './steps/FamilyDetails';
import BankDetails from './steps/BankDetails';
import DocumentsUpload from './steps/DocumentsUpload';
// import ReviewSubmit from './steps/ReviewSubmit';
import logo from '@shared/assets/icons/Logo.png';
import background from '@shared/assets/icons/header-bg.png';

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
    backgroundImage: `url(${background})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'repeat',
    position: 'relative',
    borderBottom: '1px solid #FAFAFA', // border-gray-200
    width: '100%',
    opacity: 0.8,
  },
};

const headerContentStyles: IStackStyles = {
  root: {
    width: '100%',
    padding: '24px 40px', // py-6 px-10
    position: 'relative',
    zIndex: 10,
  },
};

const overlayStyles = mergeStyles({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(255, 255, 255, 0.1)', // bg-white/10
  backdropFilter: 'blur(2px)',
});

const logoContainerStyles = mergeStyles({
  width: 140,
  height: 140,
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
    backgroundColor: '#FAFAFA', // Dark gray
    padding: 32,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    height: '100%', // Full height of the parent container
    overflowY: 'auto', // Scroll if content overflows
  },
};

// --- Sub-components ---

const StepIndicator = ({ step, isActive, isCompleted }: { step: Step, isActive: boolean, isCompleted: boolean }) => {
  return (
    <Stack horizontal tokens={{ childrenGap: 16 }} verticalAlign="start" className={isActive ? '' : 'opacity-70'}>
      <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold border-2 transition-all ${
        isActive 
          ? 'bg-gray-900 text-white border-gray-900' 
          : isCompleted 
            ? 'bg-green-500 text-white border-green-500' 
            : 'bg-transparent text-gray-400 border-gray-300'
      }`}>
        {isCompleted ? '✓' : step.id}
      </div>
      <Stack className="pt-[10px] pb-0.5 justify-center">
        <Text variant="small" className="uppercase tracking-wider text-gray-500 font-semibold mb-0.5">
          STEP {step.id}
        </Text>
        <Text variant="large" className={`font-bold ${isActive ? 'text-gray-900' : 'text-gray-600'}`}>
          {step.title}
        </Text>
      </Stack>
    </Stack>
  );
};

const RegistrationContent = () => {
  // Direct destructuring - TypeScript should infer types from the hook's return type
  const { currentStep, completedSteps, prevStep, isLoading } = useRegistration();

  const handleCancel = () => {
    window.location.href = '/signin';
  };

  const renderStepObject = () => {
    switch (currentStep) {
      case 1: return <IdentityDetails />;
      case 2: return <PersonalDetails />;
      case 3: return <FamilyDetails />;
      case 4: return <BankDetails />;
      case 5: return <DocumentsUpload />;
      // case 6: return <ReviewSubmit />;
      default: return <IdentityDetails />;
    }
  };

  const progressPercentage = (completedSteps.length / STEPS.length) * 100;

  return (
    <>
      <SEO
        title="Leo Muthu Scholarship Application"
        description="Online Registration for Scholarship Assistance - Academic Year 2025-2026"
        url="/registration"
      />
      <Stack className="h-screen overflow-hidden bg-gray-50">

        {/* Header - Fixed Height */}
        <Stack horizontal verticalAlign="center" styles={headerStyles} disableShrink>
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
              <Stack horizontalAlign="center" tokens={{ childrenGap: 8 }}>
                <Text variant="xxLarge" className="font-semibold text-gray-900">
                  Leo Muthu Scholarship Application
                </Text>
                <Text variant="large" className="font-medium text-gray-800">
                  Online Registration for Scholarship Assistance - Academic Year 2025-2026
                </Text>
                <Text variant="medium" className="text-gray-700 mt-1">
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
          <Stack styles={sidebarStyles} disableShrink>
            <Stack tokens={{ childrenGap: 32 }} className="mb-8">
              <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
                <Stack className="mb-5">
                  <Text variant="xLarge" className="font-bold text-[30px]">
                    Online registration
                  </Text>
                  <Text variant="small" className="text-gray-400 text-sm mt-0.5">Getting started</Text>
                </Stack>

                {/* Progress Circle - SVG Implementation */}
                <div className="relative w-[60px] h-[60px] flex items-center justify-center">
                  <svg width="60" height="60" viewBox="0 0 72 72" className="rotate-[-90deg]">
                    {/* Track */}
                    <circle
                      cx="36" cy="36" r="32"
                      fill="white"
                      stroke="#dbeafe"
                      strokeWidth="4"
                    />
                    {/* Progress Arc */}
                    <circle
                      cx="36" cy="36" r="32"
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="4"
                      strokeDasharray={2 * Math.PI * 32}
                      strokeDashoffset={(2 * Math.PI * 32) * (1 - (progressPercentage / 100))}
                      strokeLinecap="round"
                      className="transition-[stroke-dashoffset] duration-500 ease-out"
                    />
                  </svg>
                  <div className="absolute text-gray-800 font-bold text-base">
                    {completedSteps.length}/{STEPS.length}
                  </div>
                </div>
              </Stack>
            </Stack>

            <Stack tokens={{ childrenGap: 24 }}>
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

          {/* Main Form Content Wrapper - Flex Container */}
          <Stack grow className="flex flex-col h-full bg-white rounded-tr-xl">

            {/* Scrollable Content Area */}
            <Stack grow className="overflow-y-auto py-8 px-10">
              <Stack className="mb-8">
                <Text className="text-blue-600 text-[0.625rem] font-bold uppercase tracking-wider mb-2">
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
                variant="outline"
                onClick={handleCancel}
              >
                Cancel
              </Button>

              <Stack horizontal tokens={{ childrenGap: 16 }}>
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>
                <Button
                  type="submit"
                  form="current-step-form"
                  variant="default"
                  disabled={isLoading}
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
