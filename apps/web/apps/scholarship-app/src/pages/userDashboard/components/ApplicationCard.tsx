import * as React from "react";
import { Card, DocumentIcon, MoreIcon, ReopenIcon, PrintIcon } from "@shared/components";

export interface ApplicationCardData {
  applicationNo: string;
  status: "Registered" | "Completed" | "Pending" | "Rejected";
  studentName: string;
  studied: string;
  fatherName: string;
  applied: string;
  scholarshipNumber?: string;
  mobileNo: string;
  preparedBy?: string;
}

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const isCompleted = status === "Completed";
  const isRegistered = status === "Registered";

  const badgeClasses = `inline-flex items-center px-3 py-1 rounded-full text-xs font-medium font-inter ${
    isCompleted
      ? "bg-[#f1faf1] text-[#0e700e] border border-[#9fd89f]"
      : isRegistered
      ? "bg-[#ebf3fc] text-[#115ea3] border border-[#b4d6fa]"
      : "bg-[#f5f5f5] text-[#424242] border border-[#d1d1d1]"
  }`;

  return <span className={badgeClasses}>{status}</span>;
};

const DetailRow: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs leading-[18px] font-medium text-[#707070] font-inter">
        {label}
      </span>
      <span className="text-[13px] leading-5 font-semibold text-[#242424] font-inter">
        {value}
      </span>
    </div>
  );
};

export const ApplicationCard: React.FC<{ data: ApplicationCardData }> = ({ data }) => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleToggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleReopen = () => {
    console.log("Reopen application:", data.applicationNo);
    setIsDropdownOpen(false);
  };

  const handlePrint = () => {
    console.log("Print document:", data.applicationNo);
    setIsDropdownOpen(false);
  };

  return (
    <Card
      variant="outline"
      className="p-0 rounded-lg border border-[#e0e0e0] relative grid grid-rows-[auto_1fr] h-full overflow-hidden gap-0"
    >
      {/* Top Section - 50% height with background color */}
      <div className="flex flex-col justify-between bg-[#FAFAFA] p-5 rounded-t-lg h-[85%] border-b border-[#e0e0e0]">
        {/* Header with Application No, Status, and Icons */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 md:gap-0">
          {/* Section 1: Application No */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 md:gap-0">
            <div className="flex items-center gap-2">
              <DocumentIcon
                width={16}
                height={16}
                style={{ color: "#616161" }}
              />
              <span className="text-sm leading-5 font-semibold text-[#242424] font-inter">
                Application No.
              </span>
            </div>
            <span className="text-sm leading-6 font-semibold text-[#242424] font-inter pl-6">
              {data.applicationNo}
            </span>
          </div>

          {/* Section 2: Status badge and More icon */}
          <div className="flex items-center gap-3 relative">
            <StatusBadge status={data.status} />
            <div ref={dropdownRef} className="relative">
              <button
                onClick={handleToggleDropdown}
                className="w-6 h-6 flex items-center justify-center border-none bg-transparent cursor-pointer -mr-[5px]"
                aria-label="Options"
              >
                <MoreIcon
                  width={26}
                  height={26}
                  className="border border-[#e0e0e0] bg-white rounded-[20%]"
                />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 bg-white border border-[#e0e0e0] rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.15)] z-[1000] min-w-[200px] p-1">
                  <button
                    onClick={handleReopen}
                    className="w-full flex items-center gap-2 px-3 py-2 border-none bg-transparent cursor-pointer rounded text-sm leading-5 text-[#242424] text-left whitespace-nowrap font-inter hover:bg-[#f5f5f5]"
                  >
                    <ReopenIcon width={16} height={16} />
                    <span className="whitespace-nowrap">Reopen application</span>
                  </button>
                  <button
                    onClick={handlePrint}
                    className="w-full flex items-center gap-2 px-3 py-2 border-none bg-transparent cursor-pointer rounded text-sm leading-5 text-[#242424] text-left font-inter hover:bg-[#f5f5f5]"
                  >
                    <PrintIcon width={16} height={16} />
                    <span>Print Document</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - 50% height */}
      <div className="p-5 pt-3 flex flex-col justify-start">
        {/* Application Details */}
        <div className="flex flex-col gap-5">
          {/* First Row - 3 items */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <DetailRow label="Student Name" value={data.studentName} />
            <DetailRow label="Studied" value={data.studied} />
            <DetailRow label="Father Name" value={data.fatherName} />
          </div>
          {/* Second Row - 3 items */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <DetailRow label="Applied" value={data.applied} />
            <DetailRow
              label="Scholarship Number"
              value={data.scholarshipNumber ?? "-"}
            />
            <DetailRow label="Mobile No." value={data.mobileNo} />
          </div>
          {/* Third Row - 1 item */}
          <div>
            <DetailRow label="Prepared By" value={data.preparedBy ?? "-"} />
          </div>
        </div>
      </div>
    </Card>
  );
};

