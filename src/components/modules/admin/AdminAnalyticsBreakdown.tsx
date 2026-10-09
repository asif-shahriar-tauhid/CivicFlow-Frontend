"use client";

import { BarChart3, Filter, RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useGetAdminAnalytics } from "@/hooks/dashboard.hooks";
import type { AdminDashboardData } from "@/types/dashboard.types";
import { CategoryBreakdownWidget } from "./CategoryBreakdownWidget";
import { DepartmentBreakdownWidget } from "./DepartmentBreakdownWidget";
import { FinancialVelocityWidget } from "./FinancialVelocityWidget";
import { SlaGovernanceWidget } from "./SlaGovernanceWidget";

const FALLBACK_ADMIN_ANALYTICS: AdminDashboardData = {
  statusBreakdown: [
    { status: "SUBMITTED", count: 9 },
    { status: "IN_PROGRESS", count: 1 },
    { status: "RESOLVED", count: 2 },
    { status: "CLOSED", count: 3 },
    { status: "REOPENED", count: 1 },
  ],
  categoryBreakdown: [
    {
      categoryId: "7d9c6036-95b9-4e3b-84ba-7f5b3c7aeec0",
      categoryName: "Pothole & Pavement Hazard",
      count: 4,
    },
    {
      categoryId: "935e2322-66bb-48ae-a7dd-d586d49f2f0a",
      categoryName: "Waterlogging & Drainage Choke",
      count: 4,
    },
    {
      categoryId: "81e406aa-aa97-49e5-b56e-1bafb74eea24",
      categoryName: "Commercial Construction & Excavation Permit",
      count: 2,
    },
    {
      categoryId: "77d8c539-1de9-4a74-9f6b-7c7b623a91a7",
      categoryName: "Bulk Demolition & Industrial Waste Haulage",
      count: 2,
    },
    {
      categoryId: "0eda1652-e7e4-4eb5-82cf-c558d96b24dd",
      categoryName: "Broken Streetlight & Dark Corridors",
      count: 1,
    },
    {
      categoryId: "74b45c19-7a5f-4917-9ffc-5d009961eecd",
      categoryName: "Illegal Garbage Dumping",
      count: 1,
    },
  ],
  departmentBreakdown: [
    {
      departmentId: "5d673375-4b40-498e-8e61-9deebc59704f",
      departmentName: "Roads & Civil Infrastructure Department",
      count: 5,
    },
    {
      departmentId: "09c4b994-4b9e-4099-a0a5-aaeeacc9396f",
      departmentName: "Drainage & Sewerage Department",
      count: 5,
    },
    {
      departmentId: null,
      departmentName: "Unassigned Triage Queue",
      count: 4,
    },
    {
      departmentId: "7da45ddc-3cf8-4fde-98ba-70c6c862ed42",
      departmentName: "Electrical & Public Lighting Department",
      count: 1,
    },
    {
      departmentId: "141adb23-8e0c-44b1-9e03-d5475af12f71",
      departmentName: "Solid Waste Management Department",
      count: 1,
    },
  ],
  sla: {
    totalRequests: 16,
    breachedRequests: 1,
    complianceRate: 93.75,
  },
  resolution: {
    count: 5,
    avgHours: 18.5,
    minHours: 1.1,
    maxHours: 48,
  },
  payments: {
    completed: {
      count: 6,
      totalAmount: 1450,
    },
    pending: {
      count: 6,
      totalAmount: 2000,
    },
  },
};

interface AdminAnalyticsBreakdownProps {
  onDepartmentFilterChange?: (deptId: string | undefined) => void;
  selectedDepartmentId?: string;
}

export function AdminAnalyticsBreakdown({
  onDepartmentFilterChange,
  selectedDepartmentId,
}: AdminAnalyticsBreakdownProps) {
  const [internalDeptId, setInternalDeptId] = useState<string | undefined>(
    undefined,
  );
  const activeDeptId =
    selectedDepartmentId !== undefined ? selectedDepartmentId : internalDeptId;

  const {
    data: analyticsRes,
    isLoading,
    refetch,
    isFetching,
  } = useGetAdminAnalytics(
    activeDeptId ? { departmentId: activeDeptId } : undefined,
  );

  const analytics = analyticsRes?.data || FALLBACK_ADMIN_ANALYTICS;

  const handleSelectDept = (deptId: string | undefined) => {
    setInternalDeptId(deptId);
    onDepartmentFilterChange?.(deptId);
  };

  const totalIncidents = useMemo(() => {
    if (analytics.departmentBreakdown?.length) {
      return analytics.departmentBreakdown.reduce(
        (acc, curr) => acc + curr.count,
        0,
      );
    }
    return analytics.sla.totalRequests || 16;
  }, [analytics]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <BarChart3 className="size-5 text-primary" />
              <span>Full Analytics &amp; SLA Breakdown</span>
            </h2>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Live cross-departmental workload distribution, SLA breach
            monitoring, and municipal revenue velocities.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <div className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground shadow-xs">
            <Filter className="size-3 text-primary" />
            <select
              value={activeDeptId || ""}
              onChange={(e) => handleSelectDept(e.target.value || undefined)}
              aria-label="Filter by department"
              className="bg-transparent font-medium text-foreground focus:outline-hidden cursor-pointer"
            >
              <option value="">All Municipal Departments</option>
              {analytics.departmentBreakdown.map((dept) => (
                <option
                  key={dept.departmentId || "unassigned"}
                  value={dept.departmentId || ""}
                >
                  {dept.departmentName} ({dept.count})
                </option>
              ))}
            </select>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="gap-1.5 rounded-4xl text-xs h-8 shadow-xs"
          >
            {isFetching ? (
              <Spinner className="size-3" />
            ) : (
              <RefreshCw className="size-3" />
            )}
            <span>Sync Telemetry</span>
          </Button>
        </div>
      </div>

      {isLoading && !analyticsRes ? (
        <div className="h-64 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card/50">
          <Spinner className="size-6 text-primary" />
          <span className="text-xs text-muted-foreground font-mono">
            Aggregating municipal telemetry across departments...
          </span>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <DepartmentBreakdownWidget
                departments={analytics.departmentBreakdown}
                totalIncidents={totalIncidents}
                selectedDepartmentId={activeDeptId}
                onSelectDepartment={handleSelectDept}
              />
            </div>

            <div className="lg:col-span-1">
              <SlaGovernanceWidget
                sla={analytics.sla}
                resolution={analytics.resolution}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CategoryBreakdownWidget
                categories={analytics.categoryBreakdown}
                totalIncidents={totalIncidents}
              />
            </div>

            <div className="lg:col-span-1">
              <FinancialVelocityWidget payments={analytics.payments} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
