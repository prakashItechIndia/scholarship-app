import * as React from "react";
import { Card, CardContent } from "@shared/components";

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ icon, value, label, color }) => {
  return (
    <Card className="rounded-lg border-none bg-white shadow-sm hover:shadow-md transition-shadow" style={{ backgroundColor: color }}>
      <CardContent className="p-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-14 h-14 rounded-[50%] bg-[#ffffff] flex items-center justify-center">
              <div className="text-[#2453C3] text-[28px] flex items-center justify-center">
                {icon}
              </div>
            </div>
            <div className="text-[40px] font-semibold text-[#242424] leading-none">
              {typeof value === "number" ? value.toLocaleString() : value}
          <div className="text-sm font-normal text-[#616161] leading-none">
            {label}
          </div>
          </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

