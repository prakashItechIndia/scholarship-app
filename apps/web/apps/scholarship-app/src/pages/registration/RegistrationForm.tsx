import { Stack, Text, Image, mergeStyles, IStackStyles, ImageFit, PrimaryButton, DefaultButton } from '@fluentui/react';
import { SEO } from '../../components/seo/SEO';
import { RegistrationProvider, useRegistration } from '@/contexts/RegistrationContext';
import IdentityDetails from './steps/IdentityDetails';
import PersonalDetails from './steps/PersonalDetails';
import FamilyDetails from './steps/FamilyDetails';
import BankDetails from './steps/BankDetails';
import DocumentsUpload from './steps/DocumentsUpload';
import ReviewSubmit from './steps/ReviewSubmit';
import logo from '../../assets/logo.png';
import background from '../../assets/header-bg.png';

const STEPS = [
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

const StepIndicator = ({ step, isActive, isCompleted }: { step: any, isActive: boolean, isCompleted: boolean }) => {
  return (
    <Stack horizontal tokens={{ childrenGap: 16 }} verticalAlign="start" className={isActive ? '' : 'opacity-70'}>
      <div className={mergeStyles({
        width: 32, height: 32, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 14, fontWeight: 'bold', border: '2px solid',
        transition: 'all 0.2s',
        backgroundColor: isActive ? '#111827' : (isCompleted ? '#22c55e' : 'transparent'), // gray-900 / green-500
        color: isActive || isCompleted ? 'white' : '#9ca3af', // gray-400
        borderColor: isActive ? '#111827' : (isCompleted ? '#22c55e' : '#d1d5db'), // gray-300
      })}>
        {isCompleted ? '✓' : step.id}
      </div>
      <Stack styles={{ root: { paddingTop: 10, paddingBottom: 2, justifyContent: 'center' } }}>
        <Text variant="small" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6b7280', fontWeight: 600, marginBottom: 2, }}>
          STEP {step.id}
        </Text>
        <Text variant="large" style={{ fontWeight: 700, color: isActive ? '#111827' : '#4b5563' }}>
          {step.title}
        </Text>
      </Stack>
    </Stack>
  );
};

const RegistrationContent = () => {
  const { currentStep, completedSteps, prevStep } = useRegistration();

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
        url="/registration"
      />
      <Stack style={{ height: '100vh', overflow: 'hidden', backgroundColor: '#f9fafb' }}> {/* bg-gray-50 */}

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
                <Text variant="xxLarge" style={{ fontWeight: 600, color: '#111827' }}>
                  Leo Muthu Scholarship Application
                </Text>
                <Text variant="large" style={{ fontWeight: 500, color: '#1f2937' }}>
                  Online Registration for Scholarship Assistance - Academic Year 2025-2026
                </Text>
                <Text variant="medium" style={{ color: '#374151', marginTop: 4 }}>
                  Complete the form below to apply for our scholarship program
                </Text>
              </Stack>
            </Stack.Item>

            {/* Spacer */}
            <Stack.Item disableShrink>
              <div style={{ width: 120, display: 'none' }} className="lg:block"></div>
            </Stack.Item>
          </Stack>
        </Stack>

        {/* Main Body - Fills remaining height */}
        <Stack horizontal grow styles={{ root: { overflow: 'hidden', width: '100%' } }}>

          {/* Sidebar - Fixed Width, Scrollable inside if needed */}
          <Stack styles={sidebarStyles} disableShrink>
            <Stack tokens={{ childrenGap: 32 }} style={{ marginBottom: 32 }}>
              <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
                <Stack style={{ marginBottom: 20 }}>
                  <Text variant="xLarge" style={{ fontWeight: 'bold', fontSize: 30 }}>
                    Online registration
                  </Text>
                  <Text variant="small" style={{ color: '#9ca3af', fontSize: 14, marginTop: 2 }}>Getting started</Text>
                </Stack>

                {/* Progress Circle - SVG Implementation */}
                <div style={{ position: 'relative', width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="60" height="60" viewBox="0 0 72 72" style={{ transform: 'rotate(-90deg)' }}>
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
                      style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
                    />
                  </svg>
                  <div style={{ position: 'absolute', color: '#1f2937', fontWeight: 'bold', fontSize: 16 }}>
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
          <Stack grow styles={{ root: { display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'white', borderTopRightRadius: 12 } }}>

            {/* Scrollable Content Area */}
            <Stack grow styles={{ root: { overflowY: 'auto', padding: '32px 40px' } }}>
              <Stack style={{ marginBottom: 32 }}>
                <Text style={{ color: '#2563eb', fontSize: '0.625rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
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
              styles={{
                root: {
                  padding: '24px 40px',
                  borderTop: '1px solid #e5e7eb',
                  backgroundColor: 'white',
                  zIndex: 10,
                  flexShrink: 0
                }
              }}
            >
              <DefaultButton
                text="Cancel"
                onClick={handleCancel}
                styles={{ root: { height: 40, borderRadius: 9, minWidth: 90, borderColor: '#d1d5db' } }}
              />

              <Stack horizontal tokens={{ childrenGap: 16 }}>
                <DefaultButton
                  text="Previous"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  styles={{ root: { height: 40, borderRadius: 9, minWidth: 90, borderColor: '#f3f4f6' } }}
                />
                <PrimaryButton
                  text={currentStep === 6 ? 'Submit' : 'Next'}
                  type="submit"
                  form="current-step-form"
                  styles={{ root: { height: 40, borderRadius: 9, minWidth: 90, backgroundColor: '#1d4ed8' } }}
                />
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
