import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Input,
  Select,
  Button,
  Card,
  Label,
  PageActionButtons,
} from "@shared/components";
import { Spinner, SpinnerSize } from "@fluentui/react";


// ProfileAvatar component - SVG as React component
const ProfileAvatar = ({ width = 80, height = 80, className = '' }: { width?: number; height?: number; className?: string }) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 50 50" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M17.1875 25C12.8728 25 9.375 21.5022 9.375 17.1875C9.375 12.8728 12.8728 9.375 17.1875 9.375C21.5022 9.375 25 12.8728 25 17.1875C25 21.5022 21.5022 25 17.1875 25ZM18.2292 12.2396C18.2292 11.8081 17.8794 11.4583 17.4479 11.4583C17.0164 11.4583 16.6667 11.8081 16.6667 12.2396V16.1458H12.7604C12.3289 16.1458 11.9792 16.4956 11.9792 16.9271C11.9792 17.3586 12.3289 17.7083 12.7604 17.7083H16.6667V21.6146C16.6667 22.0461 17.0164 22.3958 17.4479 22.3958C17.8794 22.3958 18.2292 22.0461 18.2292 21.6146V17.7083H22.1354C22.5669 17.7083 22.9167 17.3586 22.9167 16.9271C22.9167 16.4956 22.5669 16.1458 22.1354 16.1458H18.2292V12.2396ZM12.5 25.3083C12.8347 25.5019 13.1825 25.6754 13.5417 25.8272V34.8958C13.5417 35.5113 13.6942 36.0912 13.9635 36.5997L24.1923 26.282C25.2111 25.2543 26.8723 25.2543 27.891 26.282L38.1199 36.5997C38.3892 36.0912 38.5417 35.5113 38.5417 34.8958V17.1875C38.5417 15.174 36.9094 13.5417 34.8958 13.5417H25.8272C25.6754 13.1825 25.5019 12.8347 25.3083 12.5H34.8958C37.4847 12.5 39.5833 14.5987 39.5833 17.1875V34.8958C39.5833 37.4847 37.4847 39.5833 34.8958 39.5833H17.1875C14.5987 39.5833 12.5 37.4847 12.5 34.8958V25.3083ZM17.1875 38.5417H34.8958C35.9143 38.5417 36.8352 38.1241 37.4967 37.4507L27.1513 27.0153C26.54 26.3987 25.5433 26.3987 24.932 27.0153L14.5866 37.4507C15.2481 38.1241 16.169 38.5417 17.1875 38.5417ZM35.4167 20.8333C35.4167 22.8469 33.7844 24.4792 31.7708 24.4792C29.7573 24.4792 28.125 22.8469 28.125 20.8333C28.125 18.8198 29.7573 17.1875 31.7708 17.1875C33.7844 17.1875 35.4167 18.8198 35.4167 20.8333ZM34.375 20.8333C34.375 19.3951 33.2091 18.2292 31.7708 18.2292C30.3326 18.2292 29.1667 19.3951 29.1667 20.8333C29.1667 22.2716 30.3326 23.4375 31.7708 23.4375C33.2091 23.4375 34.375 22.2716 34.375 20.8333Z" fill="white"/>
    </svg>
  );
};
import { UserFormData, userRoleOptions } from "../types";
import { userManagement } from "../../../services/scholarship.service";
import { useToast } from "@/components/ui/toast";

const UserForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const { success, error: showError } = useToast();
  const isEditMode = !!id;
  const [loading, setLoading] = React.useState(false);
  const [userRoles, setUserRoles] = React.useState<{ value: string; label: string }[]>([]);
  
  const [formData, setFormData] = React.useState<UserFormData>({
    name: "",
    userRole: "",
    emailId: "",
    phoneNumber: "",
    status: "Active",
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_profilePhoto, setProfilePhoto] = React.useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = React.useState<string | null>(null);
  const [isHovered, setIsHovered] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [errors, setErrors] = React.useState<{
    name?: string;
    userRole?: string;
    emailId?: string;
    phoneNumber?: string;
  }>({});

  // Load user roles from API
  React.useEffect(() => {
    const loadUserRoles = async () => {
      try {
        const roles = await userManagement.getUserTypes();
        const mappedRoles = roles.map((role: { Id: number; Role_Name: string }) => ({
          value: String(role.Id),
          label: role.Role_Name,
        }));
        setUserRoles(mappedRoles);
      } catch (err) {
        showError('Failed to Load Roles', err instanceof Error ? err.message : 'Failed to fetch user roles');
      }
    };
    void loadUserRoles();
  }, [showError]);

  // Load user data if editing
  React.useEffect(() => {
    const loadUser = async () => {
      if (isEditMode && id) {
        try {
          setLoading(true);
          const userData = await userManagement.getUserById(id);
          setFormData({
            name: userData.User_Name || "",
            userRole: String(userData.Role_Id || ""),
            emailId: userData.EMail_Id || "",
            phoneNumber: userData.Mobile_Number || "",
            status: userData.IsActive === 1 ? "Active" : "Inactive",
          });
        } catch (err) {
          showError('Failed to Load User', err instanceof Error ? err.message : 'Failed to fetch user data');
        } finally {
          setLoading(false);
        }
      }
    };
    void loadUser();
  }, [id, isEditMode, showError]);

  const handleInputChange = (field: keyof UserFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        showError('Invalid File Type', 'Please upload only PNG, JPG, or JPEG files');
        return;
      }

      // Validate file size (5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        showError('File Too Large', 'File size must be less than 5MB');
        return;
      }

      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfilePhotoClick = () => {
    fileInputRef.current?.click();
  };

  // Validate email format
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate phone number (should include country code +91)
  const validatePhoneNumber = (phone: string): boolean => {
    // Should start with +91 or 91
    const phoneRegex = /^(\+91|91)\s?\d{10}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  };

  const handleSave = async () => {
    const newErrors: typeof errors = {};

    // Validate required fields
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.userRole) {
      newErrors.userRole = "User role is required";
    }

    // USR-001: Email address shall be unique and serve as secondary login identifier
    if (!formData.emailId.trim()) {
      newErrors.emailId = "Email is required";
    } else if (!validateEmail(formData.emailId)) {
      newErrors.emailId = "Please enter a valid email address";
    } else {
      // Check for unique email via API
      try {
        const checkResult = await userManagement.checkUserId(formData.emailId.trim());
        if (checkResult.exists) {
          // If editing, check if it's the same user
          if (isEditMode && id && id === formData.emailId.trim()) {
            // Same user, allow
          } else {
            newErrors.emailId = "Email address must be unique. This email is already registered.";
          }
        }
      } catch (err) {
        // If check fails, continue (might be network error)
        console.warn('Failed to check email uniqueness', err);
      }
    }

    // Validate phone number (should include country code +91)
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!validatePhoneNumber(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must include country code (+91 or 91) followed by 10 digits";
    }

    setErrors(newErrors);

    // If there are errors, don't proceed
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      setLoading(true);
      // Generate temporary password for new users (backend will handle email)
      const tempPassword = isEditMode ? "TempPassword123!" : `Temp${Date.now()}`;
      
      const userData = {
        userType: parseInt(formData.userRole, 10),
        name: formData.name.trim(),
        userName: formData.emailId.trim(), // Email is used as username
        password: tempPassword, // Backend will encrypt
        mobileNumber: formData.phoneNumber.trim(),
        email: formData.emailId.trim().toLowerCase(),
        isActive: formData.status === "Active" ? 1 : 0,
      };

      if (isEditMode && id) {
        await userManagement.updateUser(userData);
        success('Success', 'User updated successfully');
      } else {
        await userManagement.createUser(userData);
        success('Success', 'User created successfully. Temporary password sent via email.');
      }
      
      // Store action for list page refresh
      sessionStorage.setItem("userAction", isEditMode ? "edit" : "add");
      
      // Navigate back to list
      navigate("/user-management");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save user';
      showError('Save Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/user-management");
  };

  return (
    <>
      {/* Title Section */}
      <PageActionButtons
        title={
          <div style={{ marginBottom: "0px" }}>
            <h1 style={{
              fontSize: "16px",
              // lineHeight: "40px",
              fontWeight: 700,
              color: "#242424",
              // marginBottom: "8px",
              fontFamily: "'Inter', sans-serif",
              paddingLeft: "24px",
              paddingTop: "15px",
            }}>
              {isEditMode ? "Edit User" : "Add New User"}
            </h1>
            <p style={{
              fontSize: "12px",
              lineHeight: "20px",
              color: "#707070",
              fontFamily: "'Inter', sans-serif",
              paddingLeft: "24px",
            }}>
              {isEditMode ? "Update user details and access levels." : "Enter user details to create a new account."}
            </p>
          </div>
        }
      />

      <Card variant="elevated" style={{
        border: "1px solid #e0e0e0",
        backgroundColor: "#ffffff",
        // borderRadius: "8px",
        padding: "24px",
        paddingBottom: "20px",
        boxShadow:"none"
      }}>
        {/* Profile Photo Section */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "24px",
          // marginBottom: "32px",
          paddingBottom: "32px",
          // borderBottom: "1px solid #e0e0e0",
        }}>
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleProfilePhotoClick}
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              backgroundColor: "rgba(50, 48, 48, 1)",
              opacity: profilePhotoPreview ? 1 : 0.9,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {profilePhotoPreview ? (
              <>
                <img
                  src={profilePhotoPreview}
                  alt="Profile"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    backgroundColor: "#54545400",
                  }}
                />
                {isHovered && (
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    transition: "opacity 0.3s",
                  }}>
                    <span style={{
                      color: "#ffffff",
                      fontSize: "10px",
                      lineHeight: "12px",
                      fontWeight: 600,
                      textAlign: "center",
                      padding: "0 8px",
                    }}>
                      Click to Add Photo
                    </span>
                  </div>
                )}
              </>
            ) : (
              <>
                {!isHovered && (
                  <ProfileAvatar 
                    width={80} 
                    height={80} 
                  />
                )}
                {isHovered && (
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    transition: "opacity 0.3s",
                  }}>
                    <span style={{
                      color: "#ffffff",
                      fontSize: "10px",
                      lineHeight: "12px",
                      fontWeight: 600,
                      textAlign: "center",
                      padding: "0 8px",
                    }}>
                      Click to Add Photo
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
          <div>
            <Label style={{
              fontSize: "12px",
              lineHeight: "20px",
              fontWeight: 500,
              color: "#242424",
              marginBottom: "4px",
              display: "block",
            }}>
              Profile Photo
            </Label>
            <p style={{
              fontSize: "12px",
              lineHeight: "16px",
              color: "#616161",
              fontFamily: "'Inter', sans-serif",
            }}>
              Supported formats: PNG, JPG and JPEG (up to 5MB)
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleFileSelect}
            style={{ display: "none" }}
          />
        </div>

        {/* User Details Section */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
          marginBottom: "32px",
          paddingBottom: "32px",
          borderBottom: "1px solid #e0e0e0",
          marginLeft: "-24px",
          marginRight: "-24px",
          paddingLeft: "24px",
          paddingRight: "24px",
        }}>
          <div>
            <Label style={{
              fontSize: "12px",
              lineHeight: "20px",
              fontWeight: 500,
              color: "#242424",
              marginBottom: "8px",
              display: "block",
            }}>
              Name <span style={{ color: "#dc2626" }}>*</span>
            </Label>
            <Input
              placeholder="ie: John"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              errorMessage={errors.name}
              // style={{ height: "32px" }}
            />
          </div>

          <div>
            <Label style={{
              fontSize: "12px",
              lineHeight: "20px",
              fontWeight: 500,
              color: "#242424",
              marginBottom: "8px",
              display: "block",
            }}>
              User Role <span style={{ color: "#dc2626" }}>*</span>
            </Label>
            <Select
              placeholder="Select"
              options={userRoles.length > 0 ? userRoles : userRoleOptions}
              selectedKey={formData.userRole}
              onValueChange={(value) => handleInputChange("userRole", value)}
              errorMessage={errors.userRole}
              style={{ width: "100%" }}
            />
          </div>

          <div>
            <Label style={{
              fontSize: "12px",
              lineHeight: "20px",
              fontWeight: 500,
              color: "#242424",
              marginBottom: "8px",
              display: "block",
            }}>
              Email <span style={{ color: "#dc2626" }}>*</span>
            </Label>
            <Input
              type="email"
              placeholder="ie: johndoe@mail.com"
              value={formData.emailId}
              onChange={(e) => handleInputChange("emailId", e.target.value)}
              errorMessage={errors.emailId}
              // style={{ height: "32px" }}
            />
          </div>

          <div>
            <Label style={{
              fontSize: "12px",
              lineHeight: "20px",
              fontWeight: 500,
              color: "#242424",
              marginBottom: "8px",
              display: "block",
            }}>
              Phone Number <span style={{ color: "#dc2626" }}>*</span>
            </Label>
            <Input
              type="tel"
              placeholder="ie: 91 9876543210"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              errorMessage={errors.phoneNumber}
              style={{ width: "100%" }}
            />
          </div>

          <div>
            <Label style={{
              fontSize: "12px",
              lineHeight: "20px",
              fontWeight: 500,
              color: "#242424",
              marginBottom: "8px",
              display: "block",
            }}>
              Status <span style={{ color: "#dc2626" }}>*</span>
            </Label>
            <div style={{
              display: "flex",
              gap: "24px",
              marginTop: "8px",
            }}>
              <label style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                fontSize: "13px",
                lineHeight: "20px",
                color: "#242424",
                fontFamily: "'Inter', sans-serif",
              }}>
                <input
                  type="radio"
                  name="status"
                  value="Active"
                  checked={formData.status === "Active"}
                  onChange={(e) => handleInputChange("status", e.target.value as "Active" | "Inactive")}
                  style={{
                    width: "16px",
                    height: "16px",
                    cursor: "pointer",
                    accentColor: "#0f6cbd",
                  }}
                />
                Active
              </label>
              <label style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                fontSize: "13px",
                lineHeight: "20px",
                color: "#242424",
                fontFamily: "'Inter', sans-serif",
              }}>
                <input
                  type="radio"
                  name="status"
                  value="Inactive"
                  checked={formData.status === "Inactive"}
                  onChange={(e) => handleInputChange("status", e.target.value as "Active" | "Inactive")}
                  style={{
                    width: "16px",
                    height: "16px",
                    cursor: "pointer",
                    accentColor: "#0f6cbd",
                  }}
                />
                Inactive
              </label>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "12px",
          marginLeft: "-24px",
          marginRight: "-24px",
          paddingLeft: "24px",
          paddingRight: "24px",
          paddingTop: "30px",  
          marginTop: "-40px",
          // borderTop: "1px solid #e0e0e0",
        }}>
          <Button
            appearance="secondary"
            onClick={handleCancel}
            style={{
              backgroundColor: "#f5f5f5",
              color: "#242424",
              border: "1px solid #e0e0e0",
              minWidth: "100px",
            }}
          >
            Cancel
          </Button>
          <Button
            appearance="primary"
            onClick={handleSave}
            disabled={loading}
            style={{
              backgroundColor: "#0f6cbd",
              color: "#ffffff",
              minWidth: "100px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {loading ? (
              <>
                <Spinner size={SpinnerSize.small} styles={{ circle: { borderTopColor: "#FFFFFF", borderBottomColor: "#FFFFFF", borderLeftColor: "#FFFFFF", borderRightColor: "#FFFFFF" } }} />
                <span>Saving...</span>
              </>
            ) : (
              isEditMode ? "Update" : "Save"
            )}
          </Button>
        </div>
      </Card>
    </>
  );
};

export default UserForm;

