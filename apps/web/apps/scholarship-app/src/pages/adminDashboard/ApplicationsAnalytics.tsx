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
          icon={
            <div className="relative w-6 h-6">
              <PeopleRegular className="w-6 h-6 absolute top-0 left-0" />
              <PeopleRegular className="w-5 h-5 absolute bottom-0 right-0 text-blue-500" style={{ transform: 'translate(2px, 2px)' }} />
            </div>
          }
          value={totalApplications}
          label="Total Applications"
        />
        <StatCard
          icon={<DocumentRegular className="w-6 h-6" />}
          value={submitted}
          label="Submitted"
        />
        <StatCard
          icon={
            <div className="relative w-6 h-6">
              <DocumentRegular className="w-6 h-6" />
              <CheckmarkCircleRegular className="w-4 h-4 absolute -bottom-0.5 -right-0.5 text-green-600 bg-white rounded-full" style={{ transform: 'scale(0.8)' }} />
            </div>
          }
          value={approved}
          label="Approved"
        />
        <StatCard
          icon={
            <div className="relative w-6 h-6">
              <DocumentRegular className="w-6 h-6" />
              <SearchRegular className="w-4 h-4 absolute -bottom-0.5 -right-0.5 text-blue-600 bg-white rounded-full" style={{ transform: 'scale(0.8)' }} />
            </div>
          }
          value={underReview}
          label="Under Review"
        />
      </div>
    </div>
  );
};

