import * as React from "react";
import ReportUploadIcon from "../../../assets/images/ReportUpload.svg";

const EmptyState: React.FC = () => {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "80px 24px",
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{
        marginBottom: "16px",
      }}>
        <img
          src={ReportUploadIcon}
          alt="Report Upload"
          style={{
            width: "36px",
            height: "36px",
          }}
        />
      </div>
      <h3 style={{
        fontSize: "16px",
        lineHeight: "22px",
        fontWeight: 600,
        color: "#242424",
        marginBottom: "8px",
        fontFamily: "'Base', sans-serif",
      }}>
        No Report Generated
      </h3>
      <p style={{
        fontSize: "14px",
        lineHeight: "20px",
        color: "##707070",
        textAlign: "center",
        maxWidth: "400px",
        fontFamily: "'Base', sans-serif",
      }}>
        Apply filters such as Year, Date, Gender, Status to generate customized performance reports and export the results instantly.
      </p>
    </div>
  );
};

export default EmptyState;

