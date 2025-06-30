"use client";
import {
  useGetAnalyticsQuery,
  useGetPendingDisputeQuery,
  useGetPendingVerificationQuery,
} from "@/store/features/admin-analytics/adminAnalyticsApi";

import { DashboardPage } from "./dashboard-page";
export default function AccessDashboard() {
  const { data: analyticsData, isLoading: isAnalyticsLoading } =
    useGetAnalyticsQuery({});
  const { data: disputeData, isLoading: isDisputeLoading } =
    useGetPendingDisputeQuery({});
  const { data: verificationData, isLoading: isVerificationLoading } =
    useGetPendingVerificationQuery({});

  const data = {
    analytics: analyticsData,
    pendingDispute: disputeData,
    pendingVerification: verificationData,
  };

  return <DashboardPage data={data} />;
}
