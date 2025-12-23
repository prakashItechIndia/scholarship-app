import { useNavigate } from "react-router-dom";
import { Button, FilterIcon } from "@shared/components";
import { AddRegular } from "@fluentui/react-icons";
import { ApplicationCard, ApplicationCardData } from "./components/ApplicationCard";

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  // Mock data - replace with actual data from API
  const userName = "Saravanan";
  const applications: ApplicationCardData[] = [
    {
      applicationNo: "AF2510001",
      status: "Registered",
      studentName: "Saravanan Kumar",
      studied: "BE Computer Science",
      fatherName: "Ramamurthy",
      applied: "01/06/2025",
      scholarshipNumber: "",
      mobileNo: "91 9876543210",
      preparedBy: "",
    },
    {
      applicationNo: "AF25100025",
      status: "Completed",
      studentName: "Saravanan Kumar",
      studied: "BE Computer Science",
      fatherName: "Ramamurthy",
      applied: "25/01/2025",
      scholarshipNumber: "25LMSS1009",
      mobileNo: "91 9876543210",
      preparedBy: "Admin",
    },
    {
      applicationNo: "AF2510001",
      status: "Registered",
      studentName: "Saravanan Kumar",
      studied: "BE Computer Science",
      fatherName: "Ramamurthy",
      applied: "01/06/2025",
      scholarshipNumber: "",
      mobileNo: "91 9876543210",
      preparedBy: "",
    },
    {
      applicationNo: "AF25100025",
      status: "Completed",
      studentName: "Saravanan Kumar",
      studied: "BE Computer Science",
      fatherName: "Ramamurthy",
      applied: "25/01/2025",
      scholarshipNumber: "25LMSS1009",
      mobileNo: "91 9876543210",
      preparedBy: "Admin",
    },
  ];

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "#fafafa",
        // padding: "24px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Welcome Section */}
      <div style={{marginBottom: "18px",backgroundColor: "#F5F5F5",paddingTop:"12px",paddingBottom: "10px" }}>
        <h1
          style={{
            fontSize: "20px",
            // lineHeight: "36px",
            fontWeight: 700,
            color: "#242424",
            marginBottom: "4px",
            fontFamily: "'Inter', sans-serif",
            paddingLeft: "24px",
          }}
        >
          Welcome {userName}!
        </h1>
        <p
          style={{
            fontSize: "13px",
            lineHeight: "24px",
            fontWeight: 400,
            color: "#707070",
            fontFamily: "'Inter', sans-serif",
            paddingLeft: "25px",
          }}
        >
          Have a nice day!
        </p>
      </div>

      {/* Application Status Section */}
      <div style={{  }}>
        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
          <div style={{ paddingBottom: "18px" }}>
            <h2
              style={{
                fontSize: "20px",
                lineHeight: "28px",
                fontWeight: 600,
                color: "#242424",
                marginBottom: "4px",
                fontFamily: "'Inter', sans-serif",
                paddingLeft: "24px",
                
              }}
            >
              Your Application Status
            </h2>
            <p
              style={{
                fontSize: "14px",
                lineHeight: "20px",
                fontWeight: 400,
                color: "#616161",
                fontFamily: "'Inter', sans-serif",
                paddingLeft: "24px",
              }}
            >
              Track the progress of your submitted application
            </p>
          </div>
          <div className="flex items-center gap-1 mt-4 md:mt-0 px-6 md:px-0 md:mr-0 mb-6 md:mb-0">
            <Button
              variant="default"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                fontSize: "14px",
                lineHeight: "20px",
                fontWeight: 500,
                backgroundColor: "#2453C3",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                marginRight: "0",
              }}
              onClick={() => navigate("/registration")}
            >
              <AddRegular style={{ width: "18px", height: "18px" }} />
              Create New Application
            </Button>
            <Button
              variant="ghost"
              style={{
                width: "36px",
                height: "36px",
                padding: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "none",
                backgroundColor: "transparent",
                cursor: "pointer",
                marginLeft: "0",
              }}
              onClick={() => console.log("More options")}
              aria-label="More options"
            >
              <FilterIcon
                width={32}
                height={32}
                style={{ marginLeft: "13px" }}
              />
            </Button>
          </div>
        </div>

        {/* Application Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-[18px] px-6">
          {applications.map((app) => (
            <ApplicationCard key={app.applicationNo} data={app} />
          ))}
        </div>
      </div>
      <div className="h-10"></div>
    </div>
  );
};

export default UserDashboard;

