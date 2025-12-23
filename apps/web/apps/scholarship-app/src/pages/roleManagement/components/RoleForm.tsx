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
import { Role, RoleFormData, RolePermission, MODULE_NAMES } from "../types";
import { mockRoles, userTypeOptions, defaultPermissions } from "../constants";

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
  const [profilePhoto, setProfilePhoto] = React.useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = React.useState<string | null>(null);
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
          {isEditMode ? "Edit Role" : "Add Role"}
        </h1>
        <p style={{
          fontSize: "14px",
          lineHeight: "20px",
          color: "#616161",
          fontFamily: "'Inter', sans-serif",
        }}>
          Create and define a new user role with specific permissions and access levels.
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

        {/* Role Details Section */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
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
              Role <span style={{ color: "#dc2626" }}>*</span>
            </Label>
            <Input
              placeholder="Enter Role"
              value={formData.roleName}
              onChange={(e) => {
                handleInputChange("roleName", e.target.value);
                if (errors.roleName) {
                  setErrors((prev) => ({ ...prev, roleName: undefined }));
                }
              }}
              errorMessage={errors.roleName}
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
              User Type <span style={{ color: "#dc2626" }}>*</span>
            </Label>
            <Select
              placeholder="Select"
              options={userTypeOptions}
              selectedKey={formData.userType}
              onValueChange={(value) => {
                handleInputChange("userType", value);
                if (errors.userType) {
                  setErrors((prev) => ({ ...prev, userType: undefined }));
                }
              }}
              errorMessage={errors.userType}
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

        {/* Permissions Section */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <h3 style={{
              fontSize: "18px",
              lineHeight: "24px",
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
              }}>
                {errors.permissions}
              </span>
            )}
          </div>
          <div style={{
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            overflow: "hidden",
          }}>
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
            }}>
              <thead>
                <tr style={{
                  backgroundColor: "#fafafa",
                  borderBottom: "1px solid #e0e0e0",
                }}>
                  <th style={{
                    padding: "12px 16px",
                    textAlign: "left",
                    fontSize: "14px",
                    lineHeight: "20px",
                    fontWeight: 600,
                    color: "#242424",
                    fontFamily: "'Inter', sans-serif",
                    borderRight: "1px solid #e0e0e0",
                  }}>
                    Menu
                  </th>
                  <th style={{
                    padding: "12px 16px",
                    textAlign: "center",
                    fontSize: "14px",
                    lineHeight: "20px",
                    fontWeight: 600,
                    color: "#242424",
                    fontFamily: "'Inter', sans-serif",
                    borderRight: "1px solid #e0e0e0",
                  }}>
                    Create
                  </th>
                  <th style={{
                    padding: "12px 16px",
                    textAlign: "center",
                    fontSize: "14px",
                    lineHeight: "20px",
                    fontWeight: 600,
                    color: "#242424",
                    fontFamily: "'Inter', sans-serif",
                    borderRight: "1px solid #e0e0e0",
                  }}>
                    Update
                  </th>
                  <th style={{
                    padding: "12px 16px",
                    textAlign: "center",
                    fontSize: "14px",
                    lineHeight: "20px",
                    fontWeight: 600,
                    color: "#242424",
                    fontFamily: "'Inter', sans-serif",
                    borderRight: "1px solid #e0e0e0",
                  }}>
                    View
                  </th>
                  <th style={{
                    padding: "12px 16px",
                    textAlign: "center",
                    fontSize: "14px",
                    lineHeight: "20px",
                    fontWeight: 600,
                    color: "#242424",
                    fontFamily: "'Inter', sans-serif",
                  }}>
                    Delete
                  </th>
                </tr>
              </thead>
              <tbody>
                {formData.permissions.map((permission, index) => {
                  const allSelected = permission.create && permission.update && permission.view && permission.delete;
                  return (
                    <tr
                      key={index}
                      style={{
                        backgroundColor: index % 2 === 0 ? "#ffffff" : "#fafafa",
                        borderBottom: "1px solid #e0e0e0",
                      }}
                    >
                      <td style={{
                        padding: "12px 16px",
                        fontSize: "14px",
                        lineHeight: "20px",
                        color: "#242424",
                        fontFamily: "'Inter', sans-serif",
                        borderRight: "1px solid #e0e0e0",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <input
                            type="checkbox"
                            checked={allSelected}
                            onChange={(e) => handleSelectAllPermissions(index, e.target.checked)}
                            style={{
                              width: "16px",
                              height: "16px",
                              cursor: "pointer",
                              accentColor: "#0f6cbd",
                            }}
                          />
                          <span>{permission.moduleName}</span>
                        </div>
                      </td>
                      <td style={{
                        padding: "12px 16px",
                        textAlign: "center",
                        borderRight: "1px solid #e0e0e0",
                      }}>
                        <input
                          type="checkbox"
                          checked={permission.create}
                          onChange={(e) => handlePermissionChange(index, "create", e.target.checked)}
                          style={{
                            width: "16px",
                            height: "16px",
                            cursor: "pointer",
                            accentColor: "#0f6cbd",
                          }}
                        />
                      </td>
                      <td style={{
                        padding: "12px 16px",
                        textAlign: "center",
                        borderRight: "1px solid #e0e0e0",
                      }}>
                        <input
                          type="checkbox"
                          checked={permission.update}
                          onChange={(e) => handlePermissionChange(index, "update", e.target.checked)}
                          style={{
                            width: "16px",
                            height: "16px",
                            cursor: "pointer",
                            accentColor: "#0f6cbd",
                          }}
                        />
                      </td>
                      <td style={{
                        padding: "12px 16px",
                        textAlign: "center",
                        borderRight: "1px solid #e0e0e0",
                      }}>
                        <input
                          type="checkbox"
                          checked={permission.view}
                          onChange={(e) => handlePermissionChange(index, "view", e.target.checked)}
                          style={{
                            width: "16px",
                            height: "16px",
                            cursor: "pointer",
                            accentColor: "#0f6cbd",
                          }}
                        />
                      </td>
                      <td style={{
                        padding: "12px 16px",
                        textAlign: "center",
                      }}>
                        <input
                          type="checkbox"
                          checked={permission.delete}
                          onChange={(e) => handlePermissionChange(index, "delete", e.target.checked)}
                          style={{
                            width: "16px",
                            height: "16px",
                            cursor: "pointer",
                            accentColor: "#0f6cbd",
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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

export default RoleForm;

