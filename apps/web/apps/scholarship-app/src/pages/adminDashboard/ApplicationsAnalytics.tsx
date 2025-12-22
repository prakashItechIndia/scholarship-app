import * as React from "react";
import {
  PeopleRegular,
  DocumentRegular,
  CheckmarkCircleRegular,
  SearchRegular,
} from "@fluentui/react-icons";
import { StatCard } from "./components";

interface ApplicationsAnalyticsProps {
  totalApplications?: number;
  submitted?: number;
  approved?: number;
  underReview?: number;
}

export const ApplicationsAnalytics: React.FC<ApplicationsAnalyticsProps> = ({
  totalApplications = 72684,
  submitted = 2658,
  approved = 15210,
  underReview = 12531,
}) => {
  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Applications Analytics & Reports
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={"$"}
          value={totalApplications}
          label="Total Applications"
          color="#EFF6FF"
        />
        <StatCard
                    icon={"$"}
          value={submitted}
          label="Submitted"
          color="#F0FDF4"
        />
        <StatCard
          icon={"$"}
          value={approved}
          label="Approved"
          color="#FAF5FF"
        />
        <StatCard
          icon={"$"}
          value={underReview}
          label="Under Review"
          color="#FFFBEB"
        />
        <StatCard
          icon={"$"}
          value={underReview}
          label="Under Review"
          color="#FFEFEE"
        />
      </div>
    </div>
  );
};

