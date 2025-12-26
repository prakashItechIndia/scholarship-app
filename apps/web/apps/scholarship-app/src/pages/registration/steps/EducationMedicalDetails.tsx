import { z } from 'zod';
import { Stack } from '@fluentui/react';
import { useRegistrationForm } from '../hooks/useRegistrationForm';
import { StepLayout } from '../components/StepLayout';
import { getStringValue } from '../utils/registrationHelpers';
import { STACK_TOKENS } from '../utils/registrationConstants';
import { FormRowContainer, FormRow, InputField, SelectField, ChoiceGroupField } from '../components';
import { useRegistration } from '@/contexts/RegistrationContext';
import { useState, useEffect } from 'react';
import { FileUpload } from '../components/FileUpload';
import { TextField } from '@fluentui/react';
import { Controller } from 'react-hook-form';
import { dropdownOptions } from '@/services/scholarship.service';

// Combined schema for both Education and Medical details

const EducationMedicalDetails = () => {
    const { formData, updateFormData } = useRegistration();
    const [applicantType, setApplicantType] = useState<string>('');
    const [selectedMedicalFiles, setSelectedMedicalFiles] = useState<File[]>([]);

    // Get applicant type from form data
    useEffect(() => {
        const type = getStringValue(formData, 'applicantType', '');
        setApplicantType(type);
    }, [formData]);

    // Determine which schema to use based on applicant type
    const isMedical = applicantType?.toLowerCase() === 'medical';
    const isSchool = applicantType?.toLowerCase() === 'school';
    const isCollege = applicantType?.toLowerCase() === 'college';
    
    // Use union schema that accepts both education and medical fields
    // Validation will be done dynamically based on applicantType
    const combinedSchema = z.object({
        // Education fields
        typeOfInstitution: z.string().optional(),
        institutionName: z.string().optional(),
        university: z.string().optional(),
        classStudying: z.string().optional(),
        boardOfStudying: z.string().optional(),
        courceOfStudying: z.string().optional(),
        degreeType: z.string().optional(),
        degree: z.string().optional(),
        otherDegree: z.string().optional(),
        currentYear: z.string().optional(),
        currentSemester: z.string().optional(),
        specialization: z.string().optional(),
        // Medical fields
        abhaId: z.string().optional(),
        medicalReason: z.string().optional(),
        medicalDocuments: z.any().optional(),
        lastDateForAmount: z.string().optional(),
    }).superRefine((data, ctx) => {
        // Get applicantType from formData to determine validation
        const currentApplicantType = getStringValue(formData, 'applicantType', '').toLowerCase();
        const isMedicalType = currentApplicantType === 'medical';
        
        if (isMedicalType) {
            // Medical validation
            if (!data.medicalReason || data.medicalReason.trim() === '') {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Reason for medical assistance is required',
                    path: ['medicalReason'],
                });
            }
            if (!data.medicalDocuments || !Array.isArray(data.medicalDocuments) || data.medicalDocuments.length === 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'At least one medical document is required',
                    path: ['medicalDocuments'],
                });
            }
            if (!data.lastDateForAmount || data.lastDateForAmount.trim() === '') {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Last date for amount to be received is required',
                    path: ['lastDateForAmount'],
                });
            }
        } else {
            const currentApplicantType = getStringValue(formData, 'applicantType', '').toLowerCase();
            const isSchoolType = currentApplicantType === 'school';
            const isCollegeType = currentApplicantType === 'college';
            
            if (isSchoolType) {
                // School validation - only 4 required fields
                if (!data.typeOfInstitution || data.typeOfInstitution.trim() === '') {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Type of Institution is required',
                        path: ['typeOfInstitution'],
                    });
                }
                if (!data.institutionName || data.institutionName.trim() === '') {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Institution Name is required',
                        path: ['institutionName'],
                    });
                }
                if (!data.classStudying || data.classStudying.trim() === '') {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Class Studying is required',
                        path: ['classStudying'],
                    });
                }
                if (!data.boardOfStudying || data.boardOfStudying.trim() === '') {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Board of Studying is required',
                        path: ['boardOfStudying'],
                    });
                }
            } else if (isCollegeType) {
                // College validation - specific fields
                if (!data.typeOfInstitution || data.typeOfInstitution.trim() === '') {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Type of Institution is required',
                        path: ['typeOfInstitution'],
                    });
                }
                if (!data.institutionName || data.institutionName.trim() === '') {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Institution Name is required',
                        path: ['institutionName'],
                    });
                }
                if (!data.university || data.university.trim() === '') {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'University is required',
                        path: ['university'],
                    });
                }
                if (!data.courceOfStudying || data.courceOfStudying.trim() === '') {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Course of Studying is required',
                        path: ['courceOfStudying'],
                    });
                }
                // Dynamic validation based on Course of Studying
                const courseValue = data.courceOfStudying || '';
                const isMedicalOrLegal = courseValue === 'Medical' || courseValue === 'Legal';
                const isOthers = courseValue === 'Others';
                const isDiploma = courseValue === 'Diploma';
                const isPreUniversity = courseValue === 'PreUniversity';
                const isDefaultCourse = !isMedicalOrLegal && !isOthers && !isDiploma && !isPreUniversity && courseValue;

                if (isMedicalOrLegal) {
                    // Medical/Legal: Other Degree, Current Year, Current Semester required
                    if (!data.otherDegree || data.otherDegree.trim() === '') {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: 'Other Degree is required',
                            path: ['otherDegree'],
                        });
                    }
                    if (!data.currentYear || data.currentYear.trim() === '') {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: 'Current Year is required',
                            path: ['currentYear'],
                        });
                    }
                    if (!data.currentSemester || data.currentSemester.trim() === '') {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: 'Current Semester is required',
                            path: ['currentSemester'],
                        });
                    }
                } else if (isOthers) {
                    // Others: Degree Type, Other Degree, Current Year, Current Semester required
                    if (!data.degreeType || data.degreeType.trim() === '') {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: 'Degree type is required',
                            path: ['degreeType'],
                        });
                    }
                    if (!data.otherDegree || data.otherDegree.trim() === '') {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: 'Other Degree is required',
                            path: ['otherDegree'],
                        });
                    }
                    if (!data.currentYear || data.currentYear.trim() === '') {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: 'Current Year is required',
                            path: ['currentYear'],
                        });
                    }
                    if (!data.currentSemester || data.currentSemester.trim() === '') {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: 'Current Semester is required',
                            path: ['currentSemester'],
                        });
                    }
                } else if (isDiploma) {
                    // Diploma: Current Year, Current Semester required
                    if (!data.currentYear || data.currentYear.trim() === '') {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: 'Current Year is required',
                            path: ['currentYear'],
                        });
                    }
                    if (!data.currentSemester || data.currentSemester.trim() === '') {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: 'Current Semester is required',
                            path: ['currentSemester'],
                        });
                    }
                } else if (isDefaultCourse) {
                    // Default (Arts and Science, Engineering, Management, etc.): Degree Type, Degree, Current Year, Current Semester required
                    if (!data.degreeType || data.degreeType.trim() === '') {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: 'Degree type is required',
                            path: ['degreeType'],
                        });
                    }
                    if (!data.degree || data.degree.trim() === '') {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: 'Degree is required',
                            path: ['degree'],
                        });
                    }
                    if (!data.currentYear || data.currentYear.trim() === '') {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: 'Current Year is required',
                            path: ['currentYear'],
                        });
                    }
                    if (!data.currentSemester || data.currentSemester.trim() === '') {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: 'Current Semester is required',
                            path: ['currentSemester'],
                        });
                    }
                }
                // PreUniversity: No additional fields required
            } else {
                // Other Education validation (Research)
                if (!data.typeOfInstitution || data.typeOfInstitution.trim() === '') {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Type of Institution is required',
                        path: ['typeOfInstitution'],
                    });
                }
                if (!data.institutionName || data.institutionName.trim() === '') {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Institution Name is required',
                        path: ['institutionName'],
                    });
                }
                if (!data.courceOfStudying || data.courceOfStudying.trim() === '') {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Course of Studying is required',
                        path: ['courceOfStudying'],
                    });
                }
            }
        }
    });

    const { form, onSubmit } = useRegistrationForm({
        schema: combinedSchema,
        stepNumber: 4,
        defaultValues: (formData) => {
            return {
                // Education fields
                typeOfInstitution: getStringValue(formData, 'typeOfInstitution'),
                institutionName: getStringValue(formData, 'institutionName'),
                university: getStringValue(formData, 'university'),
                classStudying: getStringValue(formData, 'classStudying'),
                boardOfStudying: getStringValue(formData, 'boardOfStudying'),
                courceOfStudying: getStringValue(formData, 'courceOfStudying'),
                degreeType: getStringValue(formData, 'degreeType'),
                degree: getStringValue(formData, 'degree'),
                otherDegree: getStringValue(formData, 'otherDegree'),
                currentYear: getStringValue(formData, 'currentYear'),
                currentSemester: getStringValue(formData, 'currentSemester'),
                specialization: getStringValue(formData, 'specialization'),
                // Medical fields
                abhaId: getStringValue(formData, 'abhaId'),
                medicalReason: getStringValue(formData, 'medicalReason'),
                medicalDocuments: (formData.medicalDocuments as File[]) || [],
                lastDateForAmount: getStringValue(formData, 'lastDateForAmount'),
            };
        },
    });

    const { control, handleSubmit, formState: { errors }, watch, setValue } = form;

    // Watch for course changes to show/hide fields
    const courceOfStudying = watch('courceOfStudying');
    const degreeType = watch('degreeType');
    
    // Dynamic field visibility based on Course of Studying (for College)
    const showOtherDegreeForCollege = courceOfStudying === 'Medical' || courceOfStudying === 'Legal' || courceOfStudying === 'Others';
    const showDegreeForCollege = !showOtherDegreeForCollege && !!courceOfStudying && courceOfStudying !== 'PreUniversity' && courceOfStudying !== 'Diploma';
    const showDegreeTypeForCollege = showDegreeForCollege || courceOfStudying === 'Others';
    const showCurrentYearSemesterForCollege = courceOfStudying !== 'PreUniversity' && !!courceOfStudying;

    // For Research section (Other Education)
    const showOtherDegree = courceOfStudying === 'Medical' || courceOfStudying === 'Legal' || courceOfStudying === 'Others';
    const showDegree = !showOtherDegree && courceOfStudying && courceOfStudying !== 'PreUniversity';

    // Degree options state - fetched from API
    const [degreeOptions, setDegreeOptions] = useState<{ value: string; label: string }[]>([
        { value: '', label: '..Select..' },
    ]);

    // Fetch degree options when course or degree type changes
    useEffect(() => {
        const fetchDegrees = async () => {
            if (isCollege && courceOfStudying && degreeType && showDegreeForCollege) {
                try {
                    const degrees = await dropdownOptions.getDegrees(courceOfStudying, degreeType);
                    setDegreeOptions(degrees.length > 0 ? degrees : [{ value: '', label: '..Select..' }]);
                } catch (error) {
                    console.error('Error fetching degrees:', error);
                    setDegreeOptions([{ value: '', label: '..Select..' }]);
                }
            } else {
                setDegreeOptions([{ value: '', label: '..Select..' }]);
            }
        };
        void fetchDegrees();
    }, [courceOfStudying, degreeType, isCollege, showDegreeForCollege]);

    // Reset degree when course or degree type changes
    useEffect(() => {
        if (isCollege && (courceOfStudying || degreeType)) {
            setValue('degree', '');
        }
    }, [courceOfStudying, degreeType, isCollege, setValue]);

    // Education field options
    const institutionTypeOptions = [
        { value: 'Government', label: 'Government' },
        { value: 'Government Aided', label: 'Government Aided' },
        { value: 'Private', label: 'Private' },
    ];

    const classStudyingOptions = [
        { value: 'Pre-KG', label: 'Pre-KG' },
        { value: 'LKG', label: 'LKG' },
        { value: 'UKG', label: 'UKG' },
        { value: '1st STD', label: '1st STD' },
        { value: '2nd STD', label: '2nd STD' },
        { value: '3rd STD', label: '3rd STD' },
        { value: '4th STD', label: '4th STD' },
        { value: '5th STD', label: '5th STD' },
        { value: '6th STD', label: '6th STD' },
        { value: '7th STD', label: '7th STD' },
        { value: '8th STD', label: '8th STD' },
        { value: '9th STD', label: '9th STD' },
        { value: '10th STD', label: '10th STD' },
        { value: '11th STD', label: '11th STD' },
        { value: '12th STD', label: '12th STD' },
        { value: 'PreUniversity', label: 'PreUniversity' },
    ];

    const boardOptions = [
        { value: 'State Board (TN State)', label: 'State Board (TN State)' },
        { value: 'Central Board(CBSE)', label: 'Central Board(CBSE)' },
        { value: 'Matriculation', label: 'Matriculation' },
        { value: 'Intermediate', label: 'Intermediate' },
        { value: 'Others', label: 'Others' },
    ];

    const courseOptions = [
        { value: 'Arts and Science', label: 'Arts and Science' },
        { value: 'Engineering', label: 'Engineering' },
        { value: 'Management', label: 'Management' },
        { value: 'Medical', label: 'Medical' },
        { value: 'Legal', label: 'Legal' },
        { value: 'Diploma', label: 'Diploma' },
        { value: 'Others', label: 'Others' },
        { value: 'PreUniversity', label: 'PreUniversity' },
    ];

    const degreeTypeOptions = [
        { value: 'UG', label: 'UG' },
        { value: 'PG', label: 'PG' },
    ];

    const currentYearOptions = [
        { value: '1st Year', label: '1st Year' },
        { value: '2nd Year', label: '2nd Year' },
        { value: '3rd Year', label: '3rd Year' },
        { value: '4th Year', label: '4th Year' },
        { value: '5th Year', label: '5th Year' },
    ];

    const currentSemesterOptions = [
        { value: '1st Semester', label: '1st Semester' },
        { value: '2nd Semester', label: '2nd Semester' },
        { value: '3rd Semester', label: '3rd Semester' },
        { value: '4th Semester', label: '4th Semester' },
        { value: '5th Semester', label: '5th Semester' },
        { value: '6th Semester', label: '6th Semester' },
        { value: '7th Semester', label: '7th Semester' },
        { value: '8th Semester', label: '8th Semester' },
    ];

    const handleMedicalFileChange = (files: File[]) => {
        setSelectedMedicalFiles(files);
        setValue('medicalDocuments', files, { shouldValidate: true });
        // Also update formData in context
        updateFormData({ medicalDocuments: files });
    };

    return (
        <StepLayout
            title={isMedical ? "Medical Details" : "Education Details"}
            subtitle={isMedical ? "Fill in the medical assistance details" : "Fill in your educational information"}
        >
            <form className="w-full h-full flex flex-col" onSubmit={(e) => void handleSubmit(onSubmit)(e)} id="current-step-form">
                <Stack tokens={STACK_TOKENS}>
                    {isMedical ? (
                        // Medical Details Section
                        <>
                            <InputField
                                name="abhaId"
                                control={control}
                                errors={errors}
                                label="ABHA ID"
                                required={false}
                                placeholder="Enter ABHA ID (Optional)"
                            />

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Reason for medical assistance <span className="text-red-500">*</span>
                                </label>
                                <Controller
                                    name="medicalReason"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            multiline
                                            rows={4}
                                            placeholder="Please describe the reason for medical assistance"
                                            errorMessage={errors.medicalReason?.message as string}
                                        />
                                    )}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Medical documents upload <span className="text-red-500">*</span>
                                </label>
                                <FileUpload
                                    files={selectedMedicalFiles}
                                    onChange={handleMedicalFileChange}
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    maxSize={20 * 1024 * 1024} // 20MB
                                    multiple
                                />
                                {errors.medicalDocuments && (
                                    <p className="text-red-500 text-sm mt-1">{errors.medicalDocuments.message as string}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Last date for amount to be received <span className="text-red-500">*</span>
                                </label>
                                <Controller
                                    name="lastDateForAmount"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            type="date"
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                errors.lastDateForAmount ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                    )}
                                />
                                {errors.lastDateForAmount && (
                                    <p className="text-red-500 text-sm mt-1">{errors.lastDateForAmount.message as string}</p>
                                )}
                            </div>
                        </>
                    ) : isSchool ? (
                        // School Education Details Section - Only 4 fields
                        <>
                            <ChoiceGroupField
                                name="typeOfInstitution"
                                control={control}
                                errors={errors}
                                label="Type of Institution"
                                required
                                options={[
                                    { key: 'Government', text: 'Govt' },
                                    { key: 'Government Aided', text: 'Govt aided' },
                                    { key: 'Private', text: 'Private' },
                                ]}
                            />

                            <InputField
                                name="institutionName"
                                control={control}
                                errors={errors}
                                label="Name of Institution (Now studying)"
                                required
                                placeholder="Enter institution name"
                            />

                            <FormRowContainer>
                                <FormRow>
                                    <SelectField
                                        name="classStudying"
                                        control={control}
                                        errors={errors}
                                        label="Class Studying"
                                        required
                                        options={classStudyingOptions}
                                        placeholder="..Select.."
                                    />
                                </FormRow>
                                <FormRow>
                                    <SelectField
                                        name="boardOfStudying"
                                        control={control}
                                        errors={errors}
                                        label="Board of Studying"
                                        required
                                        options={boardOptions}
                                        placeholder="..Select.."
                                    />
                                </FormRow>
                            </FormRowContainer>
                        </>
                    ) : isCollege ? (
                        // College Education Details Section - Specific fields only
                        <>
                            <FormRowContainer>
                                <FormRow>
                                    <ChoiceGroupField
                                        name="typeOfInstitution"
                                        control={control}
                                        errors={errors}
                                        label="Type of Institution"
                                        required
                                        options={[
                                            { key: 'Government', text: 'Govt' },
                                            { key: 'Government Aided', text: 'Govt aided' },
                                            { key: 'Private', text: 'Private' },
                                        ]}
                                    />
                                </FormRow>
                                <FormRow>
                                    <InputField
                                        name="institutionName"
                                        control={control}
                                        errors={errors}
                                        label="Name of Institution (Now studying)"
                                        required
                                        placeholder="Enter institution name"
                                    />
                                </FormRow>
                                <FormRow>
                                    <InputField
                                        name="university"
                                        control={control}
                                        errors={errors}
                                        label="University"
                                        required
                                        placeholder="Enter university name"
                                    />
                                </FormRow>
                            </FormRowContainer>

                            <FormRowContainer>
                                <FormRow>
                                    <SelectField
                                        name="courceOfStudying"
                                        control={control}
                                        errors={errors}
                                        label="Course of Studying"
                                        required
                                        options={courseOptions}
                                        placeholder="..Select.."
                                    />
                                </FormRow>
                                {showDegreeTypeForCollege && (
                                    <FormRow>
                                        <ChoiceGroupField
                                            name="degreeType"
                                            control={control}
                                            errors={errors}
                                            label="Degree type"
                                            required={showDegreeTypeForCollege}
                                            options={[
                                                { key: 'UG', text: 'UG' },
                                                { key: 'PG', text: 'PG' },
                                            ]}
                                        />
                                    </FormRow>
                                )}
                                {showDegreeForCollege && (
                                    <FormRow>
                                        <SelectField
                                            name="degree"
                                            control={control}
                                            errors={errors}
                                            label="Degree"
                                            required={showDegreeForCollege}
                                            options={degreeOptions}
                                            placeholder="..Select.."
                                        />
                                    </FormRow>
                                )}
                            </FormRowContainer>

                            {showOtherDegreeForCollege && (
                                <FormRowContainer>
                                    <FormRow>
                                        <InputField
                                            name="otherDegree"
                                            control={control}
                                            errors={errors}
                                            label="Other Degree"
                                            required={showOtherDegreeForCollege}
                                            placeholder="Enter other degree"
                                        />
                                    </FormRow>
                                </FormRowContainer>
                            )}

                            {showCurrentYearSemesterForCollege && (
                                <FormRowContainer>
                                    <FormRow>
                                        <SelectField
                                            name="currentYear"
                                            control={control}
                                            errors={errors}
                                            label="Current Year"
                                            required={showCurrentYearSemesterForCollege}
                                            options={currentYearOptions}
                                            placeholder="..Select.."
                                        />
                                    </FormRow>
                                    <FormRow>
                                        <SelectField
                                            name="currentSemester"
                                            control={control}
                                            errors={errors}
                                            label="Current Semester"
                                            required={showCurrentYearSemesterForCollege}
                                            options={currentSemesterOptions}
                                            placeholder="..Select.."
                                        />
                                    </FormRow>
                                </FormRowContainer>
                            )}
                        </>
                    ) : (
                        // Other Education Details Section (Research)
                        <>
                            <FormRowContainer>
                                <FormRow>
                                    <SelectField
                                        name="typeOfInstitution"
                                        control={control}
                                        errors={errors}
                                        label="Type of Institution"
                                        required
                                        options={institutionTypeOptions}
                                        placeholder="Select institution type"
                                    />
                                </FormRow>
                                <FormRow>
                                    <InputField
                                        name="institutionName"
                                        control={control}
                                        errors={errors}
                                        label="Name of Institution (Now studying)"
                                        required
                                        placeholder="Enter institution name"
                                    />
                                </FormRow>
                            </FormRowContainer>

                            <InputField
                                name="university"
                                control={control}
                                errors={errors}
                                label="University"
                                required={false}
                                placeholder="Enter university name"
                            />

                            <FormRowContainer>
                                <FormRow>
                                    <SelectField
                                        name="classStudying"
                                        control={control}
                                        errors={errors}
                                        label="Class Studying"
                                        required={false}
                                        options={classStudyingOptions}
                                        placeholder="Select class"
                                    />
                                </FormRow>
                                <FormRow>
                                    <SelectField
                                        name="boardOfStudying"
                                        control={control}
                                        errors={errors}
                                        label="Board of Studying"
                                        required={false}
                                        options={boardOptions}
                                        placeholder="Select board"
                                    />
                                </FormRow>
                            </FormRowContainer>

                            <SelectField
                                name="courceOfStudying"
                                control={control}
                                errors={errors}
                                label="Course of Studying"
                                required
                                options={courseOptions}
                                placeholder="Select course"
                            />

                            {showDegree && (
                                <FormRowContainer>
                                    <FormRow>
                                        <SelectField
                                            name="degreeType"
                                            control={control}
                                            errors={errors}
                                            label="Degree Type"
                                            required={false}
                                            options={degreeTypeOptions}
                                            placeholder="Select degree type"
                                        />
                                    </FormRow>
                                    <FormRow>
                                        <InputField
                                            name="degree"
                                            control={control}
                                            errors={errors}
                                            label="Degree"
                                            required={false}
                                            placeholder="Enter degree"
                                        />
                                    </FormRow>
                                </FormRowContainer>
                            )}

                            {showOtherDegree && (
                                <InputField
                                    name="otherDegree"
                                    control={control}
                                    errors={errors}
                                    label="Other Degree"
                                    required={showOtherDegree}
                                    placeholder="Enter other degree"
                                />
                            )}

                            <FormRowContainer>
                                <FormRow>
                                    <SelectField
                                        name="currentYear"
                                        control={control}
                                        errors={errors}
                                        label="Current Year"
                                        required={false}
                                        options={currentYearOptions}
                                        placeholder="Select current year"
                                    />
                                </FormRow>
                                <FormRow>
                                    <SelectField
                                        name="currentSemester"
                                        control={control}
                                        errors={errors}
                                        label="Current Semester"
                                        required={false}
                                        options={currentSemesterOptions}
                                        placeholder="Select current semester"
                                    />
                                </FormRow>
                            </FormRowContainer>

                            <InputField
                                name="specialization"
                                control={control}
                                errors={errors}
                                label="Specialization"
                                required={false}
                                placeholder="Enter specialization"
                            />
                            
                            {/* Spacing after Specialization field */}
                            <div style={{ marginBottom: '24px' }}></div>
                        </>
                    )}
                </Stack>
            </form>
        </StepLayout>
    );
};

export default EducationMedicalDetails;

