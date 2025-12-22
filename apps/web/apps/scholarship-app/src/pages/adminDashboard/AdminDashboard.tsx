import * as React from "react";
import { ApplicationsAnalytics } from "./ApplicationsAnalytics";

const AdminDashboard: React.FC = () => {
  return (
    <div className="w-full p-6 bg-gray-50 min-h-full">
      <ApplicationsAnalytics />
    </div>
  );
};

export default AdminDashboard;

