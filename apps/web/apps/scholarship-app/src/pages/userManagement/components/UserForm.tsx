import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Input,
  Select,
  Button,
  Card,
  Label,
} from "@shared/components";
import {
  CameraAddRegular,
  PersonRegular,
} from "@fluentui/react-icons";
import { User, UserFormData, userRoleOptions } from "../types";
import { mockUsers } from "../constants";

const UserForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEditMode = !!id;
  
  const [formData, setFormData] = React.useState<UserFormData>({
    name: "",
    userRole: "",
    emailId: "",
    phoneNumber: "",
    status: "Active",
  });
  const [profilePhoto, setProfilePhoto] = React.useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [errors, setErrors] = React.useState<{
    name?: string;
    userRole?: string;
    emailId?: string;
    phoneNumber?: string;
  }>({});

  // Load user data if editing
  React.useEffect(() => {
    if (isEditMode && id) {
      const user = mockUsers.find((u) => u.id === id);
      if (user) {
        setFormData({
          name: user.name,
          userRole: user.userRole,
          emailId: user.emailId,
          phoneNumber: user.mobileNumber,
          status: user.status,
        });
        if (user.profilePhoto) {
          setProfilePhotoPreview(user.profilePhoto);
        }
      }
    }
  }, [id, isEditMode]);

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
        alert("Please upload only PNG, JPG, or JPEG files");
        return;
      }

      // Validate file size (5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert("File size must be less than 5MB");
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

  const handleSave = () => {
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
      // Check for unique email
      const existingUsersJson = sessionStorage.getItem("allUsers");
      const allUsers: User[] = existingUsersJson ? JSON.parse(existingUsersJson) : mockUsers;
      
      const existingUser = allUsers.find(
        (user) => 
          user.emailId.toLowerCase() === formData.emailId.trim().toLowerCase() &&
          (!isEditMode || user.id !== id)
      );
      if (existingUser) {
        newErrors.emailId = "Email address must be unique. This email is already registered.";
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

    // USR-002: New user accounts shall receive temporary password via email
    // This would be handled by the backend API
    if (!isEditMode) {
      console.log("New user will receive temporary password via email");
    }

    // USR-003: User role assignment determines all permission levels
    // Map role to user type based on role hierarchy
    const getUserType = (role: string): "Administrator" | "Manager" | "Standard User" => {
      if (role === "CEO" || role === "Super Admin" || role === "Document Super Admin") {
        return "Administrator";
      } else if (role === "Scholarship Admin") {
        return "Manager";
      } else {
        return "Standard User";
      }
    };

    // In a real app, this would make an API call
    console.log("Saving user:", formData);
    
    // Store in sessionStorage to persist across navigation
    const savedUser: User = {
      id: isEditMode ? id! : `user-${Date.now()}`,
      name: formData.name.trim(),
      userRole: formData.userRole,
      userType: getUserType(formData.userRole),
      mobileNumber: formData.phoneNumber.trim(),
      emailId: formData.emailId.trim().toLowerCase(),
      status: formData.status,
      profilePhoto: profilePhotoPreview || undefined,
    };
    
    // Store in sessionStorage temporarily
    sessionStorage.setItem("lastSavedUser", JSON.stringify(savedUser));
    sessionStorage.setItem("userAction", isEditMode ? "edit" : "add");
    
    // Navigate back to list
    navigate("/user-management");
  };

  const handleCancel = () => {
    navigate("/user-management");
  };

  return (
    <div style={{
      width: "100%",
      height: "100%",
      backgroundColor: "#fafafa",
      padding: "24px",
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Title Section */}
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{
          fontSize: "32px",
          lineHeight: "40px",
          fontWeight: 700,
          color: "#242424",
          marginBottom: "8px",
          fontFamily: "'Inter', sans-serif",
        }}>
          {isEditMode ? "Edit User" : "Add New User"}
        </h1>
        <p style={{
          fontSize: "14px",
          lineHeight: "20px",
          color: "#616161",
          fontFamily: "'Inter', sans-serif",
        }}>
          Enter user details to create a new account.
        </p>
      </div>

      <Card variant="elevated" style={{
        border: "1px solid #e0e0e0",
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        padding: "24px",
      }}>
        {/* Profile Photo Section */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "24px",
          marginBottom: "32px",
        }}>
          <div
            onClick={handleProfilePhotoClick}
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              backgroundColor: "#f3f4f6",
              border: "2px dashed #d1d5db",
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
              <img
                src={profilePhotoPreview}
                alt="Profile"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <>
                <PersonRegular style={{
                  width: "48px",
                  height: "48px",
                  color: "#9ca3af",
                }} />
                <CameraAddRegular style={{
                  width: "24px",
                  height: "24px",
                  color: "#9ca3af",
                  position: "absolute",
                  bottom: "8px",
                  right: "8px",
                }} />
              </>
            )}
          </div>
          <div>
            <Label style={{
              fontSize: "14px",
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
        }}>
          <div>
            <Label style={{
              fontSize: "14px",
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
            />
          </div>

          <div>
            <Label style={{
              fontSize: "14px",
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
              options={userRoleOptions}
              selectedKey={formData.userRole}
              onValueChange={(value) => handleInputChange("userRole", value)}
              errorMessage={errors.userRole}
            />
          </div>

          <div>
            <Label style={{
              fontSize: "14px",
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
            />
          </div>

          <div>
            <Label style={{
              fontSize: "14px",
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
            />
          </div>

          <div>
            <Label style={{
              fontSize: "14px",
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
                fontSize: "14px",
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
                fontSize: "14px",
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
          paddingTop: "24px",
          borderTop: "1px solid #e0e0e0",
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
            style={{
              backgroundColor: "#0f6cbd",
              color: "#ffffff",
              minWidth: "100px",
            }}
          >
            Save
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default UserForm;

