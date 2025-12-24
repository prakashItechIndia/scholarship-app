import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Card,
  Label,
  PageActionButtons,
  DataTable,
} from "@shared/components";
import { Role, RoleFormData, RolePermission } from "../types";
import { mockRoles, defaultPermissions } from "../constants";
import { RoleDetailsForm } from "./RoleDetailsForm";

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

const RoleForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEditMode = !!id;
  
  const [formData, setFormData] = React.useState<RoleFormData>({
    roleName: "",
    userType: "",
    status: "Active",
    permissions: [...defaultPermissions],
  });
  // Note: profilePhoto is stored for potential file upload functionality
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_profilePhoto, setProfilePhoto] = React.useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = React.useState<string | null>(null);
  const [isHovered, setIsHovered] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [errors, setErrors] = React.useState<{
    roleName?: string;
    userType?: string;
    permissions?: string;
  }>({});

  // Load role data if editing
  React.useEffect(() => {
    if (isEditMode && id) {
      const role = mockRoles.find((r) => r.id === id);
      if (role) {
        setFormData({
          roleName: role.roleName,
          userType: role.userType || "",
          status: role.status,
          permissions: role.permissions || [...defaultPermissions],
        });
        if (role.profilePhoto) {
          setProfilePhotoPreview(role.profilePhoto);
        }
      }
    }
  }, [id, isEditMode]);

  const handleInputChange = (field: keyof RoleFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
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

  const handlePermissionChange = (
    moduleIndex: number,
    permissionType: keyof Omit<RolePermission, "moduleName">,
    value: boolean
  ) => {
    setFormData((prev) => {
      const newPermissions = [...prev.permissions];
      newPermissions[moduleIndex] = {
        ...newPermissions[moduleIndex],
        [permissionType]: value,
      };
      return {
        ...prev,
        permissions: newPermissions,
      };
    });
  };

  const handleSelectAllPermissions = (moduleIndex: number, value: boolean) => {
    setFormData((prev) => {
      const newPermissions = [...prev.permissions];
      newPermissions[moduleIndex] = {
        ...newPermissions[moduleIndex],
        create: value,
        update: value,
        view: value,
        delete: value,
      };
      return {
        ...prev,
        permissions: newPermissions,
      };
    });
  };

  const handleSelectAllRows = (value: boolean) => {
    setFormData((prev) => {
      const newPermissions = prev.permissions.map((perm) => ({
        ...perm,
        create: value,
        update: value,
        view: value,
        delete: value,
      }));
      return {
        ...prev,
        permissions: newPermissions,
      };
    });
  };


  const handleSave = () => {
    const newErrors: typeof errors = {};

    // Basic validation
    if (!formData.roleName.trim()) {
      newErrors.roleName = "Role name is required";
    }

    if (!formData.userType) {
      newErrors.userType = "User type is required";
    }

    // ROL-001: Role name shall be unique across the system
    if (formData.roleName.trim()) {
      // Get all existing roles from sessionStorage or use mockRoles
      const existingRolesJson = sessionStorage.getItem("allRoles");
      const allRoles: Role[] = existingRolesJson ? JSON.parse(existingRolesJson) : mockRoles;
      
      const existingRole = allRoles.find(
        (role) => 
          role.roleName.toLowerCase() === formData.roleName.trim().toLowerCase() &&
          (!isEditMode || role.id !== id)
      );
      if (existingRole) {
        newErrors.roleName = "Role name must be unique. This role name already exists.";
      }
    }

    // ROL-002: At least one permission shall be enabled for a valid role
    const hasAnyPermission = formData.permissions.some(
      (perm) => perm.create || perm.update || perm.view || perm.delete
    );
    if (!hasAnyPermission) {
      newErrors.permissions = "At least one permission must be enabled for the role.";
    }

    setErrors(newErrors);

    // If there are errors, don't proceed
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // In a real app, this would make an API call
    console.log("Saving role:", formData);
    
    // Store in sessionStorage to persist across navigation
    // In a real app, this would be handled by API and state management
    const savedRole = {
      id: isEditMode ? id : `role-${Date.now()}`,
      roleName: formData.roleName.trim(),
      roleType: formData.userType.toLowerCase(),
      description: "",
      status: formData.status,
      userType: formData.userType,
      profilePhoto: profilePhotoPreview || undefined,
      permissions: formData.permissions,
    };
    
    // Store in sessionStorage temporarily
    sessionStorage.setItem("lastSavedRole", JSON.stringify(savedRole));
    sessionStorage.setItem("roleAction", isEditMode ? "edit" : "add");
    
    // Navigate back to list
    navigate("/role-management");
  };

  const handleCancel = () => {
    navigate("/role-management");
  };

  const handleErrorClear = (field: "roleName" | "userType") => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // Prepare permissions data for DataTable
  const allRowsSelected = formData.permissions.every(
    (perm) => perm.create && perm.update && perm.view && perm.delete
  );
  const someRowsSelected = formData.permissions.some(
    (perm) => perm.create || perm.update || perm.view || perm.delete
  );

  const permissionsColumns = [
    {
      key: "select",
      name: "",
      width: 150,
      minWidth: 150,
      maxWidth: 150,
      cellPaddingLeft: "20px",
      cellPaddingRight: "0px",
      onRenderHeader: () => (
        <div style={{ 
          textAlign: "left",
          width: "100%",
        }}>
          <input
            type="checkbox"
            checked={allRowsSelected}
            ref={(input) => {
              if (input) {
                input.indeterminate = someRowsSelected && !allRowsSelected;
              }
            }}
            onChange={(e) => handleSelectAllRows(e.target.checked)}
            style={{
              width: "16px",
              height: "16px",
              cursor: "pointer",
              accentColor: "#0f6cbd",
            }}
          />
        </div>
      ),
      onRender: (item: RolePermission, index?: number) => {
        const allSelected = item.create && item.update && item.view && item.delete;
        return (
          <div style={{ 
            textAlign: "left",
            width: "100%",
          }}>
            <input
              type="checkbox"
              checked={allSelected}
              onChange={(e) => handleSelectAllPermissions(index!, e.target.checked)}
              style={{
                width: "16px",
                height: "16px",
                cursor: "pointer",
                accentColor: "#0f6cbd",
              }}
            />
          </div>
        );
      },
    },
    {
      key: "menu",
      name: "Menu",
      width: "auto",
      cellPaddingLeft: "2px",
      cellPaddingRight: "16px",
      onRender: (item: RolePermission) => (
        <span style={{
          fontSize: "13px",
          lineHeight: "20px",
          color: "#242424",
          fontFamily: "'Inter', sans-serif",
        }}>
          {item.moduleName}
        </span>
      ),
    },
    {
      key: "create",
      name: "Create",
      width: 150,
      minWidth: 150,
      maxWidth: 150,
      cellPaddingLeft: 4,
      cellPaddingRight: 150,
      onRenderHeader: () => (
        <div style={{ 
          textAlign: "center",
          width: "100%",
          fontSize: "13px",
          lineHeight: "20px",
          fontWeight: 600,
          color: "#424242",
          fontFamily: "'Inter', sans-serif",
        }}>
          Create
        </div>
      ),
      onRender: (item: RolePermission, index?: number) => (
        <div style={{ 
          textAlign: "center",
          width: "100%",
        }}>
          <input
            type="checkbox"
            checked={item.create}
            onChange={(e) => handlePermissionChange(index!, "create", e.target.checked)}
            style={{
              width: "16px",
              height: "16px",
              cursor: "pointer",
              accentColor: "#0f6cbd",
            }}
          />
        </div>
      ),
    },
    {
      key: "update",
      name: "Update",
      width: 150,
      minWidth: 150,
      maxWidth: 150,
      cellPaddingLeft: 4,
      cellPaddingRight: 150 ,
      onRenderHeader: () => (
        <div style={{ 
          textAlign: "center",
          width: "100%",
          fontSize: "13px",
          lineHeight: "20px",
          fontWeight: 600,
          color: "#424242",
          fontFamily: "'Inter', sans-serif",
        }}>
          Update
        </div>
      ),
      onRender: (item: RolePermission, index?: number) => (
        <div style={{ 
          textAlign: "center",
          width: "100%",
        }}>
          <input
            type="checkbox"
            checked={item.update}
            onChange={(e) => handlePermissionChange(index!, "update", e.target.checked)}
            style={{
              width: "16px",
              height: "16px",
              cursor: "pointer",
              accentColor: "#0f6cbd",
            }}
          />
        </div>
      ),
    },
    {
      key: "view",
      name: "View",
      width: 150,
      minWidth: 150,
      maxWidth: 150,
      cellPaddingLeft: 4,
      cellPaddingRight: 150,
      onRenderHeader: () => (
        <div style={{ 
          textAlign: "center",
          width: "100%",
          fontSize: "13px",
          lineHeight: "20px",
          fontWeight: 600,
          color: "#424242",
          fontFamily: "'Inter', sans-serif",
        }}>
          View
        </div>
      ),
      onRender: (item: RolePermission, index?: number) => (
        <div style={{ 
          textAlign: "center",
          width: "100%",
        }}>
          <input
            type="checkbox"
            checked={item.view}
            onChange={(e) => handlePermissionChange(index!, "view", e.target.checked)}
            style={{
              width: "16px",
              height: "16px",
              cursor: "pointer",
              accentColor: "#0f6cbd",
            }}
          />
        </div>
      ),
    },
    {
      key: "delete",
      name: "Delete",
      width: 150,
      minWidth: 150,
      maxWidth: 150,
      cellPaddingLeft: 4,
      cellPaddingRight: 150,
      onRenderHeader: () => (
        <div style={{ 
          textAlign: "center",
          width: "100%",
          fontSize: "13px",
          lineHeight: "20px",
          fontWeight: 600,
          color: "#424242",
          fontFamily: "'Inter', sans-serif",
        }}>
          Delete
        </div>
      ),
      onRender: (item: RolePermission, index?: number) => (
        <div style={{ 
          textAlign: "center",
          width: "100%",
        }}>
          <input
            type="checkbox"
            checked={item.delete}
            onChange={(e) => handlePermissionChange(index!, "delete", e.target.checked)}
            style={{
              width: "16px",
              height: "16px",
              cursor: "pointer",
              accentColor: "#0f6cbd",
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      {/* Title Section */}
      <PageActionButtons
        title={
          <div style={{ marginBottom: "10px" }}>
            <h1 style={{
              fontSize: "16px",
              // lineHeight: "40px",
              fontWeight: 600,
              color: "#242424",
              // marginBottom: "8px",
              fontFamily: "'Inter', sans-serif",
              paddingLeft: "24px",
              paddingTop: "25px",
              lineHeight: "22px",
            }}>
              {isEditMode ? "Edit Role" : "Add Role"}
            </h1>
            <p style={{
              fontSize: "12px",
              lineHeight: "16px",
              color: "#707070",
              fontFamily: "'Inter', sans-serif",
              paddingLeft: "24px",
              fontWeight: 400,
            }}>
              Create and define a new user role with specific permissions and access levels.
            </p>
          </div>
        }
      />

      <Card variant="elevated" style={{
        border: "1px solid #e0e0e0",
        backgroundColor: "#ffffff",
        // borderRadius: "8px",
        padding: "30px 24px 0px 24px",
        // height: "100%",
        // paddingBottom: "0px",
      }}>
        {/* Profile Photo Section */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          // marginBottom: "32px",
          paddingBottom: "32px",
          // borderBottom: "1px solid #e0e0e0",
        }}>
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleProfilePhotoClick}
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              backgroundColor: "rgba(50, 48, 48, 1)",
              opacity: profilePhotoPreview ? 1 : 0.8,
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
                    width: "50px",
                    height: "50px",
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
                    width={50} 
                    height={50} 
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
              fontSize: "13px",
              lineHeight: "20px",
              fontWeight: 400,
              color: "#242424",
              marginBottom: "4px",
              display: "block",
            }}>
              Profile Photo
            </Label>
            <p style={{
              fontSize: "10px",
              lineHeight: "14x",
              color: "#616161",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
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

        {/* Role Details Section */}
        <RoleDetailsForm
          formData={formData}
          errors={errors}
          onInputChange={handleInputChange}
          onErrorClear={handleErrorClear}
        />


        {/* Permissions Section */}
        <div style={{ 
          marginBottom: "30px", 
          marginLeft: "-24px",
          marginRight: "-24px",
          paddingLeft: "24px",
          paddingRight: "24px",
          paddingBottom: "32px", 
          // borderBottom: "1px solid #e0e0e0" 
          // paddingTop: "-24px",
        }}>
          <div style={{ 
            borderBottom: "1px solid #e0e0e0",
            // paddingTop: "18px",
            paddingBottom: "34px",
            marginLeft: "-24px",
            marginRight: "-24px",
            paddingLeft: "24px",
            paddingRight: "24px",
          }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "15px"}}>
              <h3 style={{
                fontSize: "13px",
                lineHeight: "20px",
                fontWeight: 600,
                color: "#242424",
                fontFamily: "'Inter', sans-serif",
                margin: 0,
              }}>
                Permissions
              </h3>
              {errors.permissions && (
                <span style={{
                  fontSize: "12px",
                  lineHeight: "16px",
                  color: "#dc2626",
                  fontFamily: "'Inter', sans-serif",
                  marginLeft: "12px",
                }}>
                  {errors.permissions}
                </span>
              )}
            </div>
          <DataTable
            columns={permissionsColumns}
            data={formData.permissions}
            cardStyle={{
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              padding: 0,
              margin: 0,
              boxShadow: "none",
              width: "80%",
            }}
            showPagination={false}
          />
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
          paddingTop: "20px",
          paddingBottom: "20px",
          marginTop: "-60px",
          // borderTop: "1px solid #e0e0e0",
        }}>
          <Button
            appearance="secondary"
            onClick={handleCancel}
            style={{
              backgroundColor: "#FFFFFF",
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
              backgroundColor: "#2453C3",
              color: "#ffffff",
              minWidth: "100px",
            }}
          >
            Save
          </Button>
        </div>
      </Card>
    </>
  );
};

export default RoleForm;

