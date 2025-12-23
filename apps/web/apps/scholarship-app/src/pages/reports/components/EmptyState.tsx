import * as React from "react";
import { DocumentError20Regular } from "@fluentui/react-icons";

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
        width: "80px",
        height: "80px",
        borderRadius: "50%",
        backgroundColor: "#fef2f2",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "24px",
      }}>
        <DocumentError20Regular style={{
          width: "40px",
          height: "40px",
          color: "#dc2626",
        }} />
      </div>
      <h3 style={{
        fontSize: "18px",
        lineHeight: "24px",
        fontWeight: 600,
        color: "#242424",
        marginBottom: "8px",
        fontFamily: "'Inter', sans-serif",
      }}>
        No Report Generated
      </h3>
      <p style={{
        fontSize: "14px",
        lineHeight: "20px",
        color: "#616161",
        textAlign: "center",
        maxWidth: "400px",
        fontFamily: "'Inter', sans-serif",
      }}>
        Apply filters such as Year, Date, Gender, Status to generate customized performance reports and export the results instantly.
      </p>
    </div>
  );
};

export default EmptyState;

