import * as React from "react";
import { Input, Select, Label } from "@shared/components";
import { RoleFormData } from "../types";
import { userTypeOptions } from "../constants";

export interface RoleDetailsFormProps {
  formData: RoleFormData;
  errors: {
    roleName?: string;
    userType?: string;
    permissions?: string;
  };
  onInputChange: (field: keyof RoleFormData, value: any) => void;
  onErrorClear: (field: "roleName" | "userType") => void;
}

export const RoleDetailsForm: React.FC<RoleDetailsFormProps> = ({
  formData,
  errors,
  onInputChange,
  onErrorClear,
}) => {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: "24px",
      marginBottom: "15px",
      marginLeft: "-24px",
      marginRight: "-24px",
      paddingLeft: "24px",
      paddingRight: "24px",
      paddingBottom: "24px",
      borderBottom: "1px solid #e0e0e0",
    }}>
      <div>
        <Label style={{
          fontSize: "13px",
          lineHeight: "20px",
          fontWeight: 400,
          color: "#242424",
          marginBottom: "6px",
          display: "block",
        }}>
          Role <span style={{ color: "#dc2626" }}>*</span>
        </Label>
        <Input
          placeholder="Enter Role"
          value={formData.roleName}
          onChange={(e) => {
            onInputChange("roleName", e.target.value);
            if (errors.roleName) {
              onErrorClear("roleName");
            }
          }}
          errorMessage={errors.roleName}
          style={{width: "100%", height: "32 px"}}
        />
      </div>

      <div>
        <Label style={{
          fontSize: "13px",
          // lineHeight: "20px",
          fontWeight: 400,
          color: "#242424",
          marginBottom: "6px",
          display: "block",
        }}>
          User Type <span style={{ color: "#dc2626" }}>*</span>
        </Label>
        <Select
          placeholder="Select"
          options={userTypeOptions}
          selectedKey={formData.userType || undefined}
          onValueChange={(value) => {
            onInputChange("userType", value);
            if (errors.userType) {
              onErrorClear("userType");
            }
          }}
          errorMessage={errors.userType}
          style={{width: "100%", height: "32px"}}
        />
      
      </div>

      <div>
        <Label style={{
          fontSize: "13px",
          lineHeight: "20px",
          fontWeight: 400,
          color: "#242424",
          marginBottom: "8px",
          display: "block",
        }}>
          Status <span style={{ color: "#dc2626" }}>*</span>
        </Label>
        <div style={{
          display: "flex",
          gap: "24px",
          marginTop: "16px",
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
            marginBottom: "8px",
          }}>
            <input
              type="radio"
              name="status"
              value="Active"
              checked={formData.status === "Active"}
              onChange={(e) => onInputChange("status", e.target.value as "Active" | "Inactive")}
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
            marginBottom: "8px",
          }}>
            <input
              type="radio"
              name="status"
              value="Inactive"
              checked={formData.status === "Inactive"}
              onChange={(e) => onInputChange("status", e.target.value as "Active" | "Inactive")}
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
  );
};

