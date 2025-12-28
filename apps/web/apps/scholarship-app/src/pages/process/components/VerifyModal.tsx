import * as React from "react";
import {
  Button,
  Input,
  Label,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@shared/components";
import {
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@fluentui/react-components";
import { Dismiss24Regular, ChevronDown24Regular, PersonMoneyRegular } from "@fluentui/react-icons";
import { ApplicationData } from "../types";
import { dropdownOptions, processManagement } from "../../../services/scholarship.service";
import { useToast } from "@/components/ui/toast";

interface VerifyModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    data?: ApplicationData | null;
    onPreviousScholarshipHistory?: () => void;
    onVerifySuccess?: () => void;
}

const VerifyModal: React.FC<VerifyModalProps> = ({
    open,
    onOpenChange,
    data,
    onPreviousScholarshipHistory,
    onVerifySuccess,
}) => {
    const { success, error: showError } = useToast();
    const [loading, setLoading] = React.useState(false);
    const [formData, setFormData] = React.useState({
        name: "",
        aadhaar: "",
        pan: "",
        studentId: "",
        dob: "",
        gender: "",
        mobileNumber: "",
        emailId: "",
        community: "",
        caste: "",
        fatherName: "",
        fatherOccupation: "",
        motherName: "",
        motherOccupation: "",
        guardianName: "",
        guardianOccupation: "",
        typeOfInstitution: "",
        nameOfInstitution: "",
        classStudying: "",
        boardOfStudying: "",
        address: "",
        city: "",
        pincode: "",
        country: "",
        state: "",
        district: "",
    });

    // Dropdown options state
    const [options, setOptions] = React.useState({
        countries: [] as { value: string; label: string }[],
        states: [] as { value: string; label: string }[],
        districts: [] as { value: string; label: string }[],
        communities: [] as { value: string; label: string }[],
        castes: [] as { value: string; label: string }[],
        occupations: [] as { value: string; label: string }[],
    });

    React.useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [
                    countries,
                    communities,
                    occupations,
                ] = await Promise.all([
                    dropdownOptions.getCountries(),
                    dropdownOptions.getCommunities(),
                    dropdownOptions.getOccupations(),
                ]);
                setOptions(prev => ({
                    ...prev,
                    countries: countries,
                    communities: communities,
                    occupations: occupations,
                }));
            } catch (error) {
                console.error("Error fetching dropdown options:", error);
            }
        };
        fetchOptions();
    }, []);

    // Fetch dependent options
    React.useEffect(() => {
        const fetchStates = async () => {
            if (formData.country) {
                try {
                    const countryId = options.countries.find(c => c.label === formData.country)?.value;
                    if (countryId) {
                        const states = await dropdownOptions.getStates(countryId);
                        setOptions(prev => ({
                            ...prev,
                            states: states,
                        }));
                    } else {
                        setOptions(prev => ({ ...prev, states: [] }));
                    }
                } catch (error) {
                    console.error("Error fetching states:", error);
                    setOptions(prev => ({ ...prev, states: [] }));
                }
            } else {
                setOptions(prev => ({ ...prev, states: [] }));
            }
        };
        fetchStates();
    }, [formData.country, options.countries]);

    React.useEffect(() => {
        const fetchDistricts = async () => {
            if (formData.state) {
                try {
                    const stateId = options.states.find(s => s.label === formData.state)?.value;
                    if (stateId) {
                        const districts = await dropdownOptions.getDistricts(stateId);
                        setOptions(prev => ({
                            ...prev,
                            districts: districts,
                        }));
                    } else {
                        setOptions(prev => ({ ...prev, districts: [] }));
                    }
                } catch (error) {
                    console.error("Error fetching districts:", error);
                    setOptions(prev => ({ ...prev, districts: [] }));
                }
            } else {
                setOptions(prev => ({ ...prev, districts: [] }));
            }
        };
        fetchDistricts();
    }, [formData.state, options.states]);

    React.useEffect(() => {
        if (data) {
            setFormData({
                name: data.studentName || "",
                aadhaar: (data.Aadhaar_No as string) || "",
                pan: (data.Pan_No as string) || "",
                studentId: (data.Student_Id as string) || (data.studentId as string) || "",
                dob: (data.DOB as string) || (data.dateOfBirth as string) || "",
                gender: (data.Gender as string) || (data.gender as string) || "",
                mobileNumber: data.mobileNumber || "",
                emailId: (data.Email_Id as string) || (data.email as string) || "",
                community: (data.Community as string) || "",
                caste: (data.Caste as string) || "",
                fatherName: data.fatherName || "",
                fatherOccupation: data.fatherOccupation || "",
                motherName: (data.Mother_Name as string) || "",
                motherOccupation: (data.Mother_Occupation as string) || "",
                guardianName: (data.Guardian_Name as string) || "",
                guardianOccupation: (data.Guardian_Occupation as string) || "",
                typeOfInstitution: (data.Institution_Type as string) || "",
                nameOfInstitution: data.institutionName || "",
                classStudying: data.classStudying || "",
                boardOfStudying: (data.Board_Of_Study as string) || "",
                address: (data.Address as string) || (data.address as string) || "",
                city: (data.City as string) || (data.city as string) || "",
                pincode: (data.Pincode as string) || (data.pincode as string) || "",
                country: (data.Country as string) || (data.country as string) || "",
                state: (data.State as string) || (data.state as string) || "",
                district: (data.District as string) || (data.district as string) || "",
            });
        }
    }, [data]);

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const renderDropdown = (
        field: string,
        value: string,
        optionsList: { value: string; label: string }[],
        placeholder: string,
        width: string = "222px"
    ) => (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <button
                    style={{
                        width: width,
                        height: "24px",
                        backgroundColor: "#F5F5F5",
                        border: "none",
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0 12px",
                        cursor: "pointer",
                        fontFamily: "'Inter', sans-serif",
                    }}
                >
                    <span style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontSize: "12px",
                        color: value ? "#707070" : "#707070",
                        fontWeight: 400,
                        lineHeight: "16px",
                    }}>
                        {value || placeholder}
                    </span>
                    <ChevronDown24Regular style={{ width: "16px", height: "16px", color: "#616161", flexShrink: 0 }} />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent style={{ width: width === "100%" ? "272px" : width }}>
                {optionsList.length > 0 ? (
                    optionsList.map((option) => (
                        <DropdownMenuItem
                            key={option.value}
                            onClick={() => handleChange(field, option.label)}
                        >
                            {option.label}
                        </DropdownMenuItem>
                    ))
                ) : (
                    <DropdownMenuItem key="no-options">No options available</DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );

    const renderInput = (
        field: string,
        value: string,
        placeholder: string = "",
        width: string = "222px",
        readOnly: boolean = false
    ) => (
        <Input
            value={value}
            onChange={(e) => handleChange(field, e.target.value)}
            placeholder={placeholder}
            readOnly={readOnly}
            style={{
                width: width,
                height: "24px",
                minHeight: "20px",
                maxHeight: "34px",
                backgroundColor: "#F5F5F5",
                border: "none",
                borderRadius: "4px",
                fontSize: "12px",
                color: value ? "#707070" : "#707070",
                fontWeight: 350,
                lineHeight: "16px",
                fontFamily: "'Inter', sans-serif",
            }}
        />
    );

    const renderLabel = (text: string) => (
        <Label
            style={{
                fontSize: "12px",
                lineHeight: "16px",
                fontWeight: 400,
                color: "#242424",
                marginBottom: "4px",
                fontFamily: "'Inter', sans-serif",
            }}
        >
            {text}
        </Label>
    );

    const maskAadhaar = (aadhaar: string) => {
        if (!aadhaar) return "";
        if (aadhaar.length <= 4) return aadhaar;
        const firstPart = "*".repeat(Math.max(0, aadhaar.length - 4));
        const lastPart = aadhaar.slice(-4);
        return firstPart + lastPart;
    };

    return (
        <Dialog open={open} onOpenChange={(_event, data) => onOpenChange(data.open)}>
            <DialogSurface
                style={{
                    width: "900px",
                    maxWidth: "900px",
                    height: "85.5vh",
                    maxHeight: "100vh",
                    position: "fixed",
                    right: 20,
                    left: "auto",
                    top: 60,
                    bottom: 0,
                    margin: 0,
                    padding: "0px",
                    borderRadius: "8px 8px 8px 8px",
                    zIndex: 1000,
                }}
            >
                <DialogBody style={{ display: "flex", flexDirection: "column", height: "100%", gap: 0 }}>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "16px 24px",
                            borderBottom: "1px solid #E0E0E0",
                        }}
                    >
                        <DialogTitle
                            style={{
                                fontSize: "16px",
                                fontWeight: 600,
                                fontFamily: "'Inter', sans-serif",
                            }}
                        >
                            Leo Muthu Scholarship - Document Verification ( 2025-2026 )
                        </DialogTitle>
                        <Button
                            appearance="subtle"
                            icon={<Dismiss24Regular />}
                            onClick={() => onOpenChange(false)}
                            style={{ color: "#424242" }}
                        />
                    </div>

                    <DialogContent style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px", overflowY: "auto" }}>
                        <style>
                            {`
                                .fui-Input__input {
                                    color: #707070 !important;
                                    font-family: 'Inter', sans-serif !important;
                                }
                            `}
                        </style>
                        {/* Row 1 */}
                        <div style={{ display: "flex", gap: "24px" }}>
                            <div style={{ flex: 1 }}>
                                {renderLabel("Student Name")}
                                {renderInput("name", formData.name)}
                            </div>
                            <div style={{ flex: 1 }}>
                                {renderLabel("Aadhaar Number")}
                                <Input
                                    value={maskAadhaar(formData.aadhaar)}
                                    readOnly
                                    style={{
                                        width: "100%",
                                        height: "24px",
                                        minHeight: "20px",
                                        maxHeight: "34px",
                                        backgroundColor: "#F5F5F5",
                                        border: "none",
                                        borderRadius: "4px",
                                        fontSize: "12px",
                                        lineHeight: "16px",
                                        fontWeight: 400,
                                        color: "#707070",
                                        fontFamily: "'Inter', sans-serif",
                                    }}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                {renderLabel("Pan No")}
                                {renderInput("pan", formData.pan)}
                            </div>
                        </div>

                        {/* Row 2 */}
                        <div style={{ display: "flex", gap: "24px" }}>
                            <div style={{ flex: 1 }}>
                                {renderLabel("Student ID")}
                                {renderInput("studentId", formData.studentId)}
                            </div>
                            <div style={{ flex: 1 }}>
                                {renderLabel("Date of Birth")}
                                {renderInput("dob", formData.dob)}
                            </div>
                            <div style={{ flex: 1 }}>
                                {renderLabel("Gender")}
                                {renderDropdown("gender", formData.gender, [{value: "Male", label: "Male"}, {value: "Female", label: "Female"}], "Select Gender")}
                            </div>
                        </div>

                        {/* Row 3 */}
                        <div style={{ display: "flex", gap: "24px" }}>
                            <div style={{ flex: 1 }}>
                                {renderLabel("Mobile Number")}
                                {renderDropdown("mobileNumber", formData.mobileNumber, [], "Select Mobile Number")}
                            </div>
                            <div style={{ flex: 1 }}>
                                {renderLabel("Email Id")}
                                {renderInput("emailId", formData.emailId)}
                            </div>
                            <div style={{ flex: 1 }}>
                                {renderLabel("Community")}
                                {renderDropdown("community", formData.community, options.communities, "Select Community")}
                            </div>
                        </div>

                        {/* Row 4 */}
                        <div style={{ display: "flex", gap: "24px" }}>
                            <div style={{ flex: 1, display: "flex", gap: "24px" }}>
                                <div style={{ width: "50%" }}>
                                    {renderLabel("Caste")}
                                    {renderDropdown("caste", formData.caste, options.castes, "Select Caste")}
                                </div>
                            </div>
                        </div>

                        {/* Row 5 */}
                        <div style={{ display: "flex", gap: "24px" }}>
                            <div style={{ flex: 1 }}>
                                {renderLabel("Father's Name")}
                                {renderInput("fatherName", formData.fatherName)}
                            </div>
                            <div style={{ flex: 1 }}>
                                {renderLabel("Father's Occupation")}
                                {renderDropdown("fatherOccupation", formData.fatherOccupation, options.occupations, "Select Occupation")}
                            </div>
                            <div style={{ flex: 1 }}>
                                {renderLabel("Mother's Name")}
                                {renderInput("motherName", formData.motherName)}
                            </div>
                        </div>

                        {/* Row 6 */}
                        <div style={{ display: "flex", gap: "24px" }}>
                            <div style={{ flex: 1 }}>
                                {renderLabel("Mother's Occupation")}
                                {renderDropdown("motherOccupation", formData.motherOccupation, options.occupations, "Select Occupation")}
                            </div>
                            <div style={{ flex: 1 }}>
                                {renderLabel("Guardian Name")}
                                {renderInput("guardianName", formData.guardianName)}
                            </div>
                            <div style={{ flex: 1 }}>
                                {renderLabel("Guardian Occupation")}
                                {renderDropdown("guardianOccupation", formData.guardianOccupation, options.occupations, "Select Occupation")}
                            </div>
                        </div>

                        {/* Row 7 */}
                        <div style={{ display: "flex", gap: "24px" }}>
                            <div style={{ flex: 1 }}>
                                {renderLabel("Type of Institution")}
                                {renderDropdown("typeOfInstitution", formData.typeOfInstitution, [], "Select Type")}
                            </div>
                            <div style={{ flex: 1 }}>
                                {renderLabel("Name of Institution (Now studying)")}
                                {renderDropdown("nameOfInstitution", formData.nameOfInstitution, [], "Select Institution")}
                            </div>
                            <div style={{ flex: 1 }}>
                                {renderLabel("Class Studying")}
                                {renderDropdown("classStudying", formData.classStudying, [], "Select Class")}
                            </div>
                        </div>

                        {/* Row 8 */}
                        <div style={{ display: "flex", gap: "24px" }}>
                            <div style={{ flex: 1, display: "flex", gap: "24px" }}>
                                <div style={{ width: "50%" }}>
                                    {renderLabel("Board of Studying")}
                                    {renderDropdown("boardOfStudying", formData.boardOfStudying, [], "Select Board")}
                                </div>
                            </div>
                        </div>

                        {/* Row 9 */}
                        <div style={{ display: "flex", gap: "24px" }}>
                            <div style={{ flex: 1 }}>
                                {renderLabel("Address")}
                                {renderInput("address", formData.address)}
                            </div>
                            <div style={{ flex: 1 }}>
                                {renderLabel("City")}
                                {renderInput("city", formData.city)}
                            </div>
                            <div style={{ flex: 1 }}>
                                {renderLabel("Pincode")}
                                {renderInput("pincode", formData.pincode)}
                            </div>
                        </div>

                        {/* Row 10 */}
                        <div style={{ display: "flex", gap: "24px", marginBottom: "0px" }}>
                            <div style={{ flex: 1 }}>
                                {renderLabel("Country")}
                                {renderDropdown("country", formData.country, options.countries, "Select Country")}
                            </div>
                            <div style={{ flex: 1 }}>
                                {renderLabel("State")}
                                {renderDropdown("state", formData.state, options.states, "Select State")}
                            </div>
                            <div style={{ flex: 1 }}>
                                {renderLabel("District")}
                                {renderDropdown("district", formData.district, options.districts, "Select District")}
                            </div>
                        </div>
                    </DialogContent>

                    <DialogActions
                        style={{
                            padding: "16px 24px",
                            borderTop: "1px solid #E0E0E0",
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: "12px",
                            marginTop: "0px",
                        }}
                    >
                        <Button
                            appearance="outline"
                            onClick={onPreviousScholarshipHistory}
                            icon={<PersonMoneyRegular />}
                            style={{
                                color: "#242424",
                                borderColor: "#D1D1D1",
                                fontWeight: 600,
                            }}
                        >
                            Previous Scholarship History
                        </Button>
                        <Button
                            appearance="primary"
                            onClick={async () => {
                                if (!data?.applicationNo) return;
                                try {
                                    setLoading(true);
                                    const authData = localStorage.getItem('scholarship_auth');
                                    const userId = authData ? JSON.parse(authData).userId : undefined;
                                    await processManagement.verifyApplication({
                                        applicationId: data.applicationNo,
                                        status: 'Verified',
                                        remarks: '',
                                        verifiedBy: userId,
                                    });
                                    success('Success', 'Application verified successfully');
                                    if (onVerifySuccess) onVerifySuccess();
                                    onOpenChange(false);
                                } catch (err) {
                                    showError('Failed to Verify', err instanceof Error ? err.message : 'Failed to verify application');
                                } finally {
                                    setLoading(false);
                                }
                            }}
                            disabled={loading}
                            style={{
                                backgroundColor: "#2453C3",
                                color: "#FFFFFF",
                                fontWeight: 600,
                                borderRadius: "10px",
                                lineHeight: "20px",
                            }}
                        >
                            {loading ? "Processing..." : "Update"}
                        </Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
};

export default VerifyModal;
