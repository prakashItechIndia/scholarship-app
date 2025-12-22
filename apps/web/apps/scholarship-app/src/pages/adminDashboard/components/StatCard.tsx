import * as React from "react";
import { Card, CardContent } from "@shared/components";

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}

export const StatCard: React.FC<StatCardProps> = ({ icon, value, label }) => {
  return (
    <Card className="rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <div className="text-blue-600 flex items-center justify-center">
                {icon}
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 leading-none">
              {typeof value === "number" ? value.toLocaleString() : value}
            </div>
          </div>
          <div className="text-sm font-normal text-gray-600 mt-1">
            {label}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

