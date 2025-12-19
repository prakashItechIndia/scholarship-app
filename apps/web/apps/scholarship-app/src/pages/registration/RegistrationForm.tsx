import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { PersonIcon } from '@/components/ui/icons';
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { PrimaryButton, DefaultButton } from '@fluentui/react';
import { SEO } from '../../components/seo/SEO';

// Step 1 Schema - Identity Verification Details
const identitySchema = z.object({
  applicantType: z.string().min(1, 'Please select an option'),
  aadhaarId: z.string().min(1, 'AADHAAR ID is required'),
  panId: z.string().min(1, 'PAN ID is required'),
});

type IdentityFormData = z.infer<typeof identitySchema>;

const STEPS = [
  { id: 1, title: 'Identity Details', key: 'identity' },
  { id: 2, title: 'Personal Details', key: 'personal' },
  { id: 3, title: 'Family details', key: 'family' },
  { id: 4, title: 'Bank details of Applicant', key: 'bank' },
  { id: 5, title: 'Documents Upload', key: 'documents' },
];

const RegistrationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const form = useForm<IdentityFormData>({
    resolver: zodResolver(identitySchema),
    defaultValues: {
      applicantType: 'I am a Research Scholar seeking Scholarship',
      aadhaarId: '9373 3038 0292',
      panId: 'PSM229802',
    },
  });

  const onSubmit = (data: IdentityFormData) => {
    console.log('Form data:', data);
    // Mark current step as completed
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    // Move to next step
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCancel = () => {
    // Handle cancel logic
    window.location.href = '/signin';
  };

  return (
    <>
      <SEO
        title="Leo Muthu Scholarship Application"
        description="Online Registration for Scholarship Assistance - Academic Year 2025-2026"
        url="/registration"
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md">
                <PersonIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-gray-800">
                  Shri. Leo Muthu Scholarship
                </h1>
                <p className="text-xs text-gray-600">
                  Founder Chairman - Sairam Institutions
                </p>
              </div>
            </div>

            {/* Title */}
            <div className="flex-1 text-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Leo Muthu Scholarship Application
              </h1>
            </div>

            {/* Spacer for alignment */}
            <div className="w-48"></div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Subtitle */}
          <div className="text-center mb-6">
            <p className="text-lg text-gray-700 font-medium">
              Online Registration for Scholarship Assistance - Academic Year 2025-2026
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Complete the form below to apply for our scholarship program
            </p>
          </div>

          <div className="flex gap-8">
            {/* Left Sidebar - Progress */}
            <aside className="w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">
                    Online registration
                  </h3>
                  <p className="text-xs text-gray-500">Getting started</p>
                </div>

                {/* Progress Badge */}
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                    {completedSteps.length}/{STEPS.length}
                  </div>
                </div>

                {/* Steps List */}
                <div className="space-y-4">
                  {STEPS.map((step) => {
                    const isActive = currentStep === step.id;
                    const isCompleted = completedSteps.includes(step.id);
                    return (
                      <div
                        key={step.id}
                        className={`flex items-center gap-3 ${
                          isActive ? 'font-semibold' : 'font-normal'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            isActive
                              ? 'bg-gray-900 text-white'
                              : isCompleted
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-200 text-gray-500'
                          }`}
                        >
                          {isCompleted ? '✓' : step.id}
                        </div>
                        <span
                          className={`text-sm ${
                            isActive ? 'text-gray-900' : 'text-gray-600'
                          }`}
                        >
                          STEP {step.id}: {step.title}
                        </span>
                      </div>
                    );
                  })}
                  <div className="flex items-center gap-3 pt-2">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                      ✓
                    </div>
                    <span className="text-sm text-gray-600">FINAL: Review and Submit</span>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
              <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
                {/* Step Indicator */}
                <div className="mb-6">
                  <span className="text-sm font-semibold text-gray-700">
                    STEP {currentStep}/{STEPS.length}
                  </span>
                </div>

                {/* Step 1: Identity Verification Details */}
                {currentStep === 1 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Identity Verification Details
                    </h2>
                    <p className="text-sm text-gray-600 mb-6">
                      Fill in the Required ID Numbers for Authentication
                    </p>

                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                      >
                        <FormField
                          control={form.control}
                          name="applicantType"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                  <span>What describes you better</span>
                                  <span className="text-red-500">*</span>
                                </label>
                                <FormControl>
                                  <select
                                    {...field}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  >
                                    <option value="I am a Research Scholar seeking Scholarship">
                                      I am a Research Scholar seeking Scholarship
                                    </option>
                                    <option value="I am a Student seeking Scholarship">
                                      I am a Student seeking Scholarship
                                    </option>
                                    <option value="Other">Other</option>
                                  </select>
                                </FormControl>
                                <FormMessage className="text-red-500 text-xs" />
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="aadhaarId"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                  <span>AADHAAR ID (Candidate)</span>
                                  <span className="text-red-500">*</span>
                                </label>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="Enter AADHAAR ID"
                                    className="bg-white"
                                  />
                                </FormControl>
                                <FormMessage className="text-red-500 text-xs" />
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="panId"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                  <span>PAN ID (Candidate)</span>
                                  <span className="text-red-500">*</span>
                                </label>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="Enter PAN ID"
                                    className="bg-white"
                                  />
                                </FormControl>
                                <FormMessage className="text-red-500 text-xs" />
                              </div>
                            </FormItem>
                          )}
                        />

                        {/* Navigation Buttons */}
                        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                          <DefaultButton
                            onClick={handleCancel}
                            className="px-6 py-2"
                          >
                            Cancel
                          </DefaultButton>
                          <DefaultButton
                            onClick={handlePrevious}
                            disabled={currentStep === 1}
                            className="px-6 py-2"
                          >
                            Previous
                          </DefaultButton>
                          <PrimaryButton
                            type="submit"
                            className="px-6 py-2"
                          >
                            Next
                          </PrimaryButton>
                        </div>
                      </form>
                    </Form>
                  </div>
                )}

                {/* Placeholder for other steps */}
                {currentStep > 1 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {STEPS[currentStep - 1].title}
                    </h2>
                    <p className="text-sm text-gray-600 mb-6">
                      Step {currentStep} content will be implemented here
                    </p>

                    <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                      <DefaultButton
                        onClick={handleCancel}
                        className="px-6 py-2"
                      >
                        Cancel
                      </DefaultButton>
                      <DefaultButton
                        onClick={handlePrevious}
                        className="px-6 py-2"
                      >
                        Previous
                      </DefaultButton>
                      <PrimaryButton
                        onClick={() => {
                          if (!completedSteps.includes(currentStep)) {
                            setCompletedSteps([...completedSteps, currentStep]);
                          }
                          if (currentStep < STEPS.length) {
                            setCurrentStep(currentStep + 1);
                          }
                        }}
                        className="px-6 py-2"
                        type="button"
                      >
                        Next
                      </PrimaryButton>
                    </div>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegistrationForm;

