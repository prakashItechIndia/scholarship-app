import * as React from "react";
import { ScholarshipReportData, ApprovedFormData, ReportTab } from "../types";
import {
  ArrowSort20Regular,
  DocumentBulletListRegular,
  DocumentPrintRegular,
  MoneyHandRegular,
  MoreHorizontalRegular,
  PrintRegular,
} from "@fluentui/react-icons";
import {
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@shared/components";
import StatusBadge from "../../process/components/StatusBadge";

interface UseReportsTableProps {
  onRowSelect?: (item: ScholarshipReportData | ApprovedFormData, selected: boolean) => void;
  onSelectAll?: (selected: boolean) => void;
  selectedRows?: Set<string>;
  data?: (ScholarshipReportData | ApprovedFormData)[];
  onViewPdf?: (item: ScholarshipReportData | ApprovedFormData) => void;
  onViewDocuments?: (item: ScholarshipReportData | ApprovedFormData) => void;
  onViewScholarshipHistory?: (item: ScholarshipReportData | ApprovedFormData) => void;
  activeTab?: ReportTab;
}

export const useReportsTable = ({
  onRowSelect,
  onSelectAll,
  selectedRows = new Set(),
  data = [],
  onViewPdf,
  onViewDocuments,
  onViewScholarshipHistory,
  activeTab = "categories-wise",
}: UseReportsTableProps) => {
  // Helper function to create sortable header
  const createSortableHeader = React.useCallback((name: string) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "4px",
        cursor: "pointer",
      }}
    >
      <span style={{
        fontSize: "13px",
        lineHeight: "19px",
        fontWeight: 500,
        color: "#424242",
        fontFamily: "'Inter', sans-serif",
      }}>
        {name}
      </span>
      <ArrowSort20Regular style={{ width: "16px", height: "16px", color: "#616161" }} />
    </div>
  ), []);

  // Helper function to get application number from any data type
  const getApplicationNo = (item: ScholarshipReportData | ApprovedFormData | undefined): string => {
    if (!item) return "";
    return (item as ScholarshipReportData).applicationNo || (item as ApprovedFormData).applicationNo || "";
  };


  // Helper to get field value from data object
  const getFieldValue = (item: any, fieldName: string): string => {
    if (!item) return "";
    
    // Handle different field name variations - map frontend field names to database field names
    const fieldMap: Record<string, string[]> = {
      "applicationNo": ["Application Id", "Application_Id", "Application_No", "applicationNo", "ApplicationId", "application_id"],
      "aadhaarId": ["Aadhaar Id", "Aadhaar_Id", "Aadhaar_No", "Aadhaar_ID", "aadhaarId", "aadhaar_id"],
      "studentName": ["Applicant Name", "Applicant_Name", "Student_Name", "Student Name", "studentName", "applicant_name"],
      "studentId": ["Student Id", "Student_Id", "Student_ID", "studentId", "student_id"],
      "classStudying": ["Class Studying", "Class_Studying", "classStudying", "class_studying"],
      "institutionName": ["Institution Name", "Institution_Name", "institutionName", "institution_name"],
      "fatherName": ["Father Name", "Father_Name", "fatherName", "father_name"],
      "fatherOfficeName": ["Father Office Name", "Father_Office_Name", "Father Office", "Father_Office", "fatherOfficeName", "father_office_name"],
      "motherName": ["Mother Name", "Mother_Name", "motherName", "mother_name"],
      "motherOfficeName": ["Mother Office Name", "Mother_Office_Name", "Mother Office", "Mother_Office", "motherOfficeName", "mother_office_name"],
      "guardianName": ["Guardian Name", "Guardian_Name", "guardianName", "guardian_name"],
      "guardianOfficeName": ["Guardian Office Name", "Guardian_Office_Name", "Guardian Office", "Guardian_Office", "guardianOfficeName", "guardian_office_name"],
      "gender": ["Gender", "gender"],
      "checkInFavor": ["DDCheque In Favor", "DDCheque_In_Favor", "Cheque In Favor", "Cheque_In_Favor", "checkInFavor", "cheque_in_favor"],
      "approvedAmount": ["Scholarship Approved Amount", "Scholarship_Approved_Amount", "Approved Amount", "Approved_Amount", "approvedAmount", "approved_amount"],
      "issuedAmount": ["Issued Amount", "Issued_Amount", "issuedAmount", "issued_amount"],
      "scholarshipId": ["Scholarship No", "Scholarship_No", "Scholarship Id", "Scholarship_Id", "Scholarship_ID", "scholarshipId", "scholarship_id"],
      "scholarship": ["Scholarship No", "Scholarship_No", "Scholarship", "scholarship"],
      "ddCheckNo": ["DDCheque No", "DDCheque_No", "DD Cheque No", "DD_Cheque_No", "ddCheckNo", "dd_check_no"],
      "donateDate": ["Donated Date", "Donated_Date", "Donate Date", "Donate_Date", "donateDate", "donated_date"],
      "bankName": ["Bank Name", "Bank_Name", "bankName", "bank_name"],
      "appliedDate": ["Applied Date", "Applied_Date", "appliedDate", "applied_date"],
      "scholarshipYear": ["ScholarshipYear Name", "ScholarshipYear_Name", "Scholarship Year", "Scholarship_Year", "scholarshipYear", "scholarship_year"],
      "scholarshipFor": ["Scholarship For", "Scholarship_For", "scholarshipFor", "scholarship_for"],
      "status": ["Status", "status"],
      "fatherAnnualIncome": ["Father Annual Income", "Father_Annual_Income", "Annual Income", "Annual_Income", "fatherAnnualIncome", "father_annual_income"],
      "mobileNumber": ["Mobile Number", "Mobile_Number", "Mobile No", "Mobile_No", "mobileNumber", "mobile_number"],
      "fatherOccupation": ["Father Occupation", "Father_Occupation", "Occupation", "fatherOccupation", "father_occupation"],
    };
    
    const possibleFields = fieldMap[fieldName] || [fieldName];
    
    // First try exact matches (case-sensitive)
    for (const field of possibleFields) {
      if (Object.prototype.hasOwnProperty.call(item, field) && item[field] !== undefined && item[field] !== null && item[field] !== "") {
        return String(item[field]);
      }
    }
    
    // Then try case-insensitive matches
    const itemKeys = Object.keys(item || {});
    for (const field of possibleFields) {
      const matchingKey = itemKeys.find(key => key.toLowerCase() === field.toLowerCase());
      if (matchingKey && item[matchingKey] !== undefined && item[matchingKey] !== null && item[matchingKey] !== "") {
        return String(item[matchingKey]);
      }
    }
    
    // Last resort: try the fieldName directly (case-insensitive)
    const directMatch = itemKeys.find(key => key.toLowerCase() === fieldName.toLowerCase());
    if (directMatch && item[directMatch] !== undefined && item[directMatch] !== null && item[directMatch] !== "") {
      return String(item[directMatch]);
    }
    
    return "";
  };

  // Columns for Categories Report and Scholarship Issued Report (Tabs 1 & 2)
  const standardReportColumns = React.useMemo(() => [
      {
        key: "checkbox",
        name: "",
        fieldName: "checkbox",
        minWidth: 48,
        maxWidth: 48,
        isSortable: false,
        onRender: (item?: ScholarshipReportData | any) => (
          <input
            type="checkbox"
            checked={item ? selectedRows.has(getApplicationNo(item)) : false}
            onChange={(e) => {
              e.stopPropagation();
              if (item && onRowSelect) {
                onRowSelect(item, e.target.checked);
              }
            }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "16px",
              height: "16px",
              cursor: "pointer",
              accentColor: "#0f6cbd",
            }}
          />
        ),
        onRenderHeader: () => {
          const allSelected = data.length > 0 && selectedRows.size === data.length;
          const someSelected = selectedRows.size > 0 && selectedRows.size < data.length;
          return (
            <input
              type="checkbox"
              checked={allSelected}
              ref={(input) => {
                if (input) {
                  input.indeterminate = someSelected;
                }
              }}
              onChange={(e) => {
                e.stopPropagation();
                if (onSelectAll) {
                  onSelectAll(e.target.checked);
                }
              }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "16px",
                height: "16px",
                cursor: "pointer",
                accentColor: "#0f6cbd",
              }}
            />
          );
        },
      },
      {
        key: "applicationNo",
        name: "Application No.",
        fieldName: "applicationNo",
        minWidth: 150,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Application No."),
        onRender: (item?: ScholarshipReportData | any) => (
          <span style={{ fontSize: "13px", lineHeight: "19px", color: "#242424", fontWeight: 400, fontFamily: "'Inter', sans-serif" }}>
            {getFieldValue(item, "applicationNo")}
          </span>
        ),
      },
      {
        key: "aadhaarId",
        name: "Aadhaar Id",
        fieldName: "aadhaarId",
        minWidth: 150,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Aadhaar Id"),
        onRender: (item?: ScholarshipReportData | any) => (
          <span style={{ fontSize: "13px", lineHeight: "19px", color: "#242424", fontWeight: 400, fontFamily: "'Inter', sans-serif" }}>
            {getFieldValue(item, "aadhaarId")}
          </span>
        ),
      },
      {
        key: "studentName",
        name: "Student Name",
        fieldName: "studentName",
        minWidth: 150,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Student Name"),
        onRender: (item?: ScholarshipReportData | any) => (
          <span style={{ fontSize: "13px", lineHeight: "19px", color: "#242424", fontWeight: 400, fontFamily: "'Inter', sans-serif" }}>
            {getFieldValue(item, "studentName")}
          </span>
        ),
      },
      {
        key: "studentId",
        name: "Student Id",
        fieldName: "studentId",
        minWidth: 120,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Student Id"),
        onRender: (item?: ScholarshipReportData | any) => (
          <span style={{ fontSize: "13px", lineHeight: "19px", color: "#242424", fontWeight: 400, fontFamily: "'Inter', sans-serif" }}>
            {getFieldValue(item, "studentId")}
          </span>
        ),
      },
      {
        key: "classStudying",
        name: "Class Studying",
        fieldName: "classStudying",
        minWidth: 150,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Class Studying"),
        onRender: (item?: ScholarshipReportData | any) => (
          <span style={{ fontSize: "13px", lineHeight: "19px", color: "#242424", fontWeight: 400, fontFamily: "'Inter', sans-serif" }}>
            {getFieldValue(item, "classStudying")}
          </span>
        ),
      },
      {
        key: "institutionName",
        name: "Institution Name",
        fieldName: "institutionName",
        minWidth: 200,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Institution Name"),
        onRender: (item?: ScholarshipReportData | any) => (
          <span style={{ fontSize: "13px", lineHeight: "19px", color: "#242424", fontWeight: 400, fontFamily: "'Inter', sans-serif" }}>
            {getFieldValue(item, "institutionName")}
          </span>
        ),
      },
      {
        key: "fatherName",
        name: "Father Name",
        fieldName: "fatherName",
        minWidth: 150,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Father Name"),
        onRender: (item?: ScholarshipReportData | any) => (
          <span style={{ fontSize: "13px", lineHeight: "19px", color: "#242424", fontWeight: 400, fontFamily: "'Inter', sans-serif" }}>{getFieldValue(item, "fatherName")}</span>
        ),
      },
      {
        key: "fatherOfficeName",
        name: "Father Office Name",
        fieldName: "fatherOfficeName",
        minWidth: 180,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Father Office Name"),
        onRender: (item?: ScholarshipReportData | any) => (
          <span style={{ fontSize: "13px", lineHeight: "19px", color: "#242424", fontWeight: 400, fontFamily: "'Inter', sans-serif" }}>{getFieldValue(item, "fatherOfficeName")}</span>
        ),
      },
      {
        key: "motherName",
        name: "Mother Name",
        fieldName: "motherName",
        minWidth: 150,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Mother Name"),
        onRender: (item?: ScholarshipReportData | any) => (
          <span style={{ fontSize: "13px", lineHeight: "19px", color: "#242424", fontWeight: 400, fontFamily: "'Inter', sans-serif" }}>{getFieldValue(item, "motherName")}</span>
        ),
      },
      {
        key: "motherOfficeName",
        name: "Mother Office Name",
        fieldName: "motherOfficeName",
        minWidth: 180,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Mother Office Name"),
        onRender: (item?: ScholarshipReportData | any) => (
          <span style={{ fontSize: "13px", lineHeight: "19px", color: "#242424", fontWeight: 400, fontFamily: "'Inter', sans-serif" }}>{getFieldValue(item, "motherOfficeName")}</span>
        ),
      },
      {
        key: "guardianName",
        name: "Guardian Name",
        fieldName: "guardianName",
        minWidth: 150,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Guardian Name"),
        onRender: (item?: ScholarshipReportData | any) => (
          <span style={{ fontSize: "13px", lineHeight: "19px", color: "#242424", fontWeight: 400, fontFamily: "'Inter', sans-serif" }}>{getFieldValue(item, "guardianName")}</span>
        ),
      },
      {
        key: "guardianOfficeName",
        name: "Guardian Office Name",
        fieldName: "guardianOfficeName",
        minWidth: 180,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Guardian Office Name"),
        onRender: (item?: ScholarshipReportData | any) => (
          <span style={{ fontSize: "13px", lineHeight: "19px", color: "#242424", fontWeight: 400, fontFamily: "'Inter', sans-serif" }}>{getFieldValue(item, "guardianOfficeName")}</span>
        ),
      },
      {
        key: "gender",
        name: "Gender",
        fieldName: "gender",
        minWidth: 100,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Gender"),
        onRender: (item?: ScholarshipReportData | any) => (
          <span style={{ fontSize: "13px", lineHeight: "19px", color: "#242424", fontWeight: 400, fontFamily: "'Inter', sans-serif" }}>{getFieldValue(item, "gender")}</span>
        ),
      },
      {
        key: "checkInFavor",
        name: "Cheque In Favor",
        fieldName: "checkInFavor",
        minWidth: 150,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Cheque In Favor"),
        onRender: (item?: ScholarshipReportData | any) => (
          <span style={{ fontSize: "13px", lineHeight: "19px", color: "#242424", fontWeight: 400, fontFamily: "'Inter', sans-serif" }}>{getFieldValue(item, "checkInFavor")}</span>
        ),
      },
      {
        key: "approvedAmount",
        name: "Approved Amount",
        fieldName: "approvedAmount",
        minWidth: 130,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Approved Amount"),
        onRender: (item?: ScholarshipReportData | any) => (
          <span style={{ fontSize: "13px", lineHeight: "19px", color: "#242424", fontWeight: 400, fontFamily: "'Inter', sans-serif" }}>{getFieldValue(item, "approvedAmount")}</span>
        ),
      },
      {
        key: "issuedAmount",
        name: "Issued Amount",
        fieldName: "issuedAmount",
        minWidth: 130,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Issued Amount"),
        onRender: (item?: ScholarshipReportData | any) => (
          <span style={{ fontSize: "13px", lineHeight: "19px", color: "#242424", fontWeight: 400, fontFamily: "'Inter', sans-serif" }}>{getFieldValue(item, "issuedAmount")}</span>
        ),
      },
      {
        key: "scholarshipId",
        name: "Scholarship ID",
        fieldName: "scholarshipId",
        minWidth: 150,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Scholarship ID"),
        onRender: (item?: ScholarshipReportData | any) => (
          <span style={{ fontSize: "13px", lineHeight: "19px", color: "#242424", fontWeight: 400, fontFamily: "'Inter', sans-serif" }}>{getFieldValue(item, "scholarshipId")}</span>
        ),
      },
      {
        key: "scholarship",
        name: "Scholarship",
        fieldName: "scholarship",
        minWidth: 150,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Scholarship"),
        onRender: (item?: ScholarshipReportData | any) => (
          <span style={{ fontSize: "13px", lineHeight: "19px", color: "#242424", fontWeight: 400, fontFamily: "'Inter', sans-serif" }}>
            {getFieldValue(item, "scholarship") || getFieldValue(item, "scholarshipId")}
          </span>
        ),
      },
      {
        key: "ddCheckNo",
        name: "DDCheckNo",
        fieldName: "ddCheckNo",
        minWidth: 150,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("DDCheckNo"),
        onRender: (item?: ScholarshipReportData | any) => (
          <span style={{ fontSize: "13px", lineHeight: "19px", color: "#242424", fontWeight: 400, fontFamily: "'Inter', sans-serif" }}>{getFieldValue(item, "ddCheckNo")}</span>
        ),
      },
      {
        key: "donateDate",
        name: "Donated Date",
        fieldName: "donateDate",
        minWidth: 120,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Donated Date"),
        onRender: (item?: ScholarshipReportData | any) => (
          <span style={{ fontSize: "13px", lineHeight: "19px", color: "#242424", fontWeight: 400, fontFamily: "'Inter', sans-serif" }}>{getFieldValue(item, "donateDate")}</span>
        ),
      },
      {
        key: "bankName",
        name: "Bank Name",
        fieldName: "bankName",
        minWidth: 150,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Bank Name"),
        onRender: (item?: ScholarshipReportData | any) => (
          <span style={{ fontSize: "13px", lineHeight: "19px", color: "#242424", fontWeight: 400, fontFamily: "'Inter', sans-serif" }}>{getFieldValue(item, "bankName")}</span>
        ),
      },
      {
        key: "appliedDate",
        name: "Applied Date",
        fieldName: "appliedDate",
        minWidth: 120,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Applied Date"),
        onRender: (item?: ScholarshipReportData | any) => (
          <span style={{ fontSize: "13px", lineHeight: "19px", color: "#242424", fontWeight: 400, fontFamily: "'Inter', sans-serif" }}>{getFieldValue(item, "appliedDate")}</span>
        ),
      },
      {
        key: "scholarshipYear",
        name: "Scholarship Year",
        fieldName: "scholarshipYear",
        minWidth: 130,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Scholarship Year"),
        onRender: (item?: ScholarshipReportData | any) => (
          <span style={{ fontSize: "13px", lineHeight: "19px", color: "#242424", fontWeight: 400, fontFamily: "'Inter', sans-serif" }}>{getFieldValue(item, "scholarshipYear")}</span>
        ),
      },
      {
        key: "scholarshipFor",
        name: "Scholarship For",
        fieldName: "scholarshipFor",
        minWidth: 150,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Scholarship For"),
        onRender: (item?: ScholarshipReportData | any) => (
          <span style={{ fontSize: "13px", lineHeight: "19px", color: "#242424", fontWeight: 400, fontFamily: "'Inter', sans-serif" }}>{getFieldValue(item, "scholarshipFor")}</span>
        ),
      },
      {
        key: "status",
        name: "Status",
        fieldName: "status",
        minWidth: 120,
        isSortable: true,
        onRenderHeader: () => createSortableHeader("Status"),
        onRender: (item?: ScholarshipReportData | any) => (
          <StatusBadge status={getFieldValue(item, "status")} />
        ),
      },
      {
        key: "actions",
        name: "", // Action column has no header text usually, or "Actions"
        fieldName: "actions",
        minWidth: 50,
        isSortable: false,
        onRender: (item?: ScholarshipReportData | any) => (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button appearance="subtle" style={{ minWidth: "auto", padding: "4px" }}>
                <MoreHorizontalRegular style={{ width: "20px", height: "20px", color: "#616161" }} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
            <DropdownMenuItem
              icon={<DocumentBulletListRegular style={{ width: "20px", height: "20px" }} />}
              label="View Documents"
              onClick={() => item && onViewDocuments && onViewDocuments(item)}
            />
            <DropdownMenuItem
              icon={<MoneyHandRegular style={{ width: "20px", height: "20px" }} />}
              label="Scholarship History"
              onClick={() => item && onViewScholarshipHistory && onViewScholarshipHistory(item)}
            />
            <DropdownMenuItem
              icon={<PrintRegular style={{ width: "20px", height: "20px" }} />}
              label="Print Details"
              onClick={() => item && onViewPdf && onViewPdf(item)}
            />
          </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ], [selectedRows, onRowSelect, onSelectAll, data, createSortableHeader, onViewPdf, onViewDocuments, onViewScholarshipHistory, getApplicationNo, getFieldValue]);

  // Columns for Approved Form Report (Tab 3)
  const approvedFormColumns = React.useMemo(() => [
    {
      key: "checkbox",
      name: "",
      fieldName: "checkbox",
      minWidth: 48,
      maxWidth: 48,
      isSortable: false,
      onRender: (item?: ApprovedFormData | any) => (
        <input
          type="checkbox"
          checked={item ? selectedRows.has(getApplicationNo(item)) : false}
          onChange={(e) => {
            e.stopPropagation();
            if (item && onRowSelect) {
              onRowSelect(item, e.target.checked);
            }
          }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "16px",
            height: "16px",
            cursor: "pointer",
            accentColor: "#0f6cbd",
          }}
        />
      ),
      onRenderHeader: () => {
        const allSelected = data.length > 0 && selectedRows.size === data.length;
        const someSelected = selectedRows.size > 0 && selectedRows.size < data.length;
        return (
          <input
            type="checkbox"
            checked={allSelected}
            ref={(input) => {
              if (input) {
                input.indeterminate = someSelected;
              }
            }}
            onChange={(e) => {
              e.stopPropagation();
              if (onSelectAll) {
                onSelectAll(e.target.checked);
              }
            }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "16px",
              height: "16px",
              cursor: "pointer",
              accentColor: "#0f6cbd",
            }}
          />
        );
      },
    },
    {
      key: "applicationNo",
      name: "Application No",
      fieldName: "applicationNo",
      minWidth: 150,
      isSortable: true,
      onRenderHeader: () => createSortableHeader("Application No"),
      onRender: (item?: ApprovedFormData | any) => (
        <span style={{ fontSize: "13px", lineHeight: "19px", color: "#242424", fontWeight: 400, fontFamily: "'Inter', sans-serif" }}>
          {getFieldValue(item, "applicationNo")}
        </span>
      ),
    },
    {
      key: "studentName",
      name: "Student Name",
      fieldName: "studentName",
      minWidth: 150,
      isSortable: true,
      onRenderHeader: () => createSortableHeader("Student Name"),
      onRender: (item?: ApprovedFormData | any) => (
        <span style={{ fontSize: "13px", lineHeight: "19px", color: "#242424", fontWeight: 400, fontFamily: "'Inter', sans-serif" }}>
          {getFieldValue(item, "studentName")}
        </span>
      ),
    },
    {
      key: "classStudying",
      name: "Class Studying",
      fieldName: "classStudying",
      minWidth: 150,
      isSortable: true,
      onRenderHeader: () => createSortableHeader("Class Studying"),
      onRender: (item?: ApprovedFormData | any) => (
        <span style={{ fontSize: "13px", lineHeight: "19px", color: "#242424", fontWeight: 400, fontFamily: "'Inter', sans-serif" }}>
          {getFieldValue(item, "classStudying")}
        </span>
      ),
    },
    {
      key: "institutionName",
      name: "Institution Name",
      fieldName: "institutionName",
      minWidth: 200,
      isSortable: true,
      onRenderHeader: () => createSortableHeader("Institution Name"),
      onRender: (item?: ApprovedFormData | any) => (
        <span style={{ fontSize: "13px", lineHeight: "19px", color: "#242424", fontWeight: 400, fontFamily: "'Inter', sans-serif" }}>
          {getFieldValue(item, "institutionName")}
        </span>
      ),
    },
    {
      key: "fatherAnnualIncome",
      name: "Father Annual Income",
      fieldName: "fatherAnnualIncome",
      minWidth: 180,
      isSortable: true,
      onRenderHeader: () => createSortableHeader("Father Annual Income"),
      onRender: (item?: ApprovedFormData | any) => (
        <span style={{ fontSize: "13px", lineHeight: "19px", color: "#242424", fontWeight: 400, fontFamily: "'Inter', sans-serif" }}>
          {getFieldValue(item, "fatherAnnualIncome")}
        </span>
      ),
    },
    {
      key: "mobileNumber",
      name: "Mobile Number",
      fieldName: "mobileNumber",
      minWidth: 150,
      isSortable: true,
      onRenderHeader: () => createSortableHeader("Mobile Number"),
      onRender: (item?: ApprovedFormData | any) => (
        <span style={{ fontSize: "13px", lineHeight: "19px", color: "#242424", fontWeight: 400, fontFamily: "'Inter', sans-serif" }}>
          {getFieldValue(item, "mobileNumber")}
        </span>
      ),
    },
    {
      key: "fatherOccupation",
      name: "Father Occupation",
      fieldName: "fatherOccupation",
      minWidth: 180,
      isSortable: true,
      onRenderHeader: () => createSortableHeader("Father Occupation"),
      onRender: (item?: ApprovedFormData | any) => (
        <span style={{ fontSize: "13px", lineHeight: "19px", color: "#242424", fontWeight: 400, fontFamily: "'Inter', sans-serif" }}>
          {getFieldValue(item, "fatherOccupation")}
        </span>
      ),
    },
    {
      key: "scholarship",
      name: "Scholarship",
      fieldName: "scholarship",
      minWidth: 150,
      isSortable: true,
      onRenderHeader: () => createSortableHeader("Scholarship"),
      onRender: (item?: ApprovedFormData | any) => (
        <span style={{ fontSize: "13px", lineHeight: "19px", color: "#242424", fontWeight: 400, fontFamily: "'Inter', sans-serif" }}>
          {getFieldValue(item, "scholarship")}
        </span>
      ),
    },
    {
      key: "status",
      name: "Status",
      fieldName: "status",
      minWidth: 120,
      isSortable: true,
      onRenderHeader: () => createSortableHeader("Status"),
      onRender: (item?: ApprovedFormData | any) => (
        <StatusBadge status={getFieldValue(item, "status")} />
      ),
    },
    {
      key: "actions",
      name: "",
      fieldName: "actions",
      minWidth: 50,
      isSortable: false,
      onRender: (item?: ApprovedFormData | any) => (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button appearance="subtle" style={{ minWidth: "auto", padding: "4px" }}>
              <MoreHorizontalRegular style={{ width: "20px", height: "20px", color: "#616161" }} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              icon={<DocumentBulletListRegular style={{ width: "20px", height: "20px" }} />}
              label="View Documents"
              onClick={() => item && onViewDocuments && onViewDocuments(item)}
            />
            <DropdownMenuItem
              icon={<MoneyHandRegular style={{ width: "20px", height: "20px" }} />}
              label="Scholarship History"
              onClick={() => item && onViewScholarshipHistory && onViewScholarshipHistory(item)}
            />
            <DropdownMenuItem
              icon={<DocumentPrintRegular style={{ width: "20px", height: "20px" }} />}
              label="Print Details"
              onClick={() => item && onViewPdf && onViewPdf(item)}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], [selectedRows, onRowSelect, onSelectAll, data, createSortableHeader, onViewPdf, onViewDocuments, onViewScholarshipHistory, getApplicationNo, getFieldValue]);

  // Return columns based on active tab
  const columns = React.useMemo(() => {
    if (activeTab === "approved-form") {
      return approvedFormColumns;
    }
    return standardReportColumns;
  }, [activeTab, standardReportColumns, approvedFormColumns]);

  return { columns };
};

