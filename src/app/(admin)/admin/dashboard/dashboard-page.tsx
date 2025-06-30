import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";

import {
  ArrowUpRight,
  Briefcase,
  ChevronDown,
  DollarSign,
  Users,
} from "lucide-react";
import Link from "next/link";
import type React from "react";
import { CircularProgress } from "./circular-progress";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  progress: number;
  progressColor: string;
  bgColor: string;
  textColor: string;
  showProgress?: boolean;
  showText?: boolean;
  data?: any;
  colorConfig?: { color: string; percentage: number; label: string }[];
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  progress,
  progressColor,
  bgColor,
  textColor,
  showText = true,
  showProgress = false,
  colorConfig,
  data,
}) => {
  return (
    <Card className={`${bgColor} ${textColor} rounded-xl shadow-lg`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="rounded-md bg-white/20 p-1.5">{icon}</div>
      </CardHeader>
      <CardContent className="mt-3 flex items-center justify-between">
        <div className="text-3xl font-bold">{Number(value)}</div>
        {showProgress && (
          <CircularProgress
            colorConfig={colorConfig}
            size={150}
            strokeWidth={20}
            data={data}
            showText={showText}
            textSize="text-sm"
            enableShadow={true}
            animationDuration={1000}
          />
        )}
      </CardContent>
    </Card>
  );
};

interface EarningSourceProps {
  name: string;
  percentage: number;
  color: string;
}

const EarningSource: React.FC<EarningSourceProps> = ({
  name,
  percentage,
  color,
}) => (
  <div className="mb-3">
    <div className="mb-1 flex justify-between text-sm text-gray-600">
      <span>{name}</span>
      <span
        className={`font-semibold ${color.startsWith("text-") ? color : "text-gray-700"}`}
      >
        {percentage}%
      </span>
    </div>
    <Progress
      value={percentage}
      className={`h-2 ${color.startsWith("bg-") ? color : "bg-gray-700"}`}
    />
  </div>
);

interface ProfileListItemProps {
  avatarSrc: string;
  name: string;
  email: string;
  date: string;
}

const ProfileListItem: React.FC<ProfileListItemProps> = ({
  avatarSrc,
  name,
  email,
  date,
}) => (
  <div className="flex items-center border-b border-gray-200 px-3 py-3 last:border-b-0">
    <Avatar className="mr-3 h-10 w-10">
      <AvatarImage src={avatarSrc || "/placeholder.svg"} alt={name} />
      <AvatarFallback>{name.substring(0, 2).toUpperCase()}</AvatarFallback>
    </Avatar>
    <div className="flex-grow">
      <p className="text-sm font-semibold text-gray-800">{name}</p>
      <p className="text-xs text-gray-500">{email}</p>
    </div>
    <div className="mr-3 text-right text-xs whitespace-nowrap text-gray-500">
      {date}
    </div>
  </div>
);

interface DisputeListItemProps {
  title: string;
  seller: string;
  date: string;
}

const DisputeListItem: React.FC<DisputeListItemProps> = ({
  title,
  seller,
  date,
}) => (
  <div className="flex items-center border-b border-gray-200 px-3 py-3 last:border-b-0">
    <div className="flex-grow">
      <p
        className="truncate text-sm font-semibold text-gray-800 capitalize"
        title={title}
      >
        {title}
      </p>
      <p className="text-xs text-gray-500">Seller: {seller}</p>
    </div>
    <div className="mr-3 text-right text-xs whitespace-nowrap text-gray-500">
      {date}
    </div>
  </div>
);

export function DashboardPage({ data }: any) {
  const { pendingVerification, pendingDispute, analytics } = data || {};
  // Convert pendingVerification data to profileVerifications format
  const profileVerifications =
    pendingVerification?.pendingSellers?.map((item: any) => ({
      avatarSrc: item.user.avatar || "/images/avatar.png",
      name: item.user.name,
      email: item.user.email,
      date: item.verificationAppliedAt
        ? new Date(item.verificationAppliedAt).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })
        : "",
    })) || [];

  // Convert pendingDispute data to recentDisputes format
  const recentDisputes =
    pendingDispute?.pendingDisputes?.map((item: any) => ({
      title:
        item.reason?.slice(0, 32) + (item.reason?.length > 32 ? "..." : ""),
      seller: item.raisedBy
        ? item.raisedBy.charAt(0).toUpperCase() + item.raisedBy.slice(1)
        : "Unknown",
      date: item.createdAt
        ? new Date(item.createdAt).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })
        : "",
    })) || [];

  console.log(analytics, "---");
  return (
    <div className="bg-gray-100 p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">
          Here's what's happening with your store today.
        </p>
      </header>

      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Revenue"
          value={analytics?.totalIncome || "0"}
          icon={<DollarSign className="h-5 w-5 text-white" />}
          progress={75}
          progressColor="#FDE047" // yellow-400
          bgColor="bg-slate-800"
          textColor="text-white"
        />
        <StatCard
          title="Total Users"
          value={analytics?.userStats?.totalUsers || "0"}
          icon={<Users className="h-5 w-5 text-white" />}
          progress={0}
          showText={false}
          data={analytics?.userStats}
          colorConfig={[
            {
              color: "#FFFF67",
              percentage: Number(analytics?.userStats?.buyers?.percentage) ?? 0,
              label: "Buyer",
            },
            {
              color: "#023D54",
              percentage:
                Number(analytics?.userStats?.sellers?.percentage) ?? 0,
              label: "Seller",
            },
          ]}
          showProgress={true}
          progressColor="#FDE047" // yellow-400
          bgColor="bg-teal-600"
          textColor="text-white"
        />
        <StatCard
          title="Total Projects"
          value={analytics?.totalProject || "0"}
          icon={<Briefcase className="h-5 w-5 text-slate-700" />}
          progress={0}
          progressColor="#0F766E" // teal-700
          bgColor="bg-green-300"
          textColor="text-slate-700"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="grid grid-cols-1 gap-6 rounded-xl shadow-lg lg:col-span-2 lg:grid-cols-3">
          <div className="col-span-2"></div>
          <Card className="col-span-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-800">
                  Total Earnings
                </CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="text-sm text-gray-600">
                      This Month <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Last Month</DropdownMenuItem>
                    <DropdownMenuItem>This Quarter</DropdownMenuItem>
                    <DropdownMenuItem>This Year</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-col items-center justify-center">
                <div className="mb-6 flex w-full items-center justify-center">
                  <CircularProgress
                    percentage={100}
                    colorConfig={[
                      {
                        color: "#334155", // slate-700
                        percentage:
                          Number(analytics?.sources?.commission?.percentage) ||
                          0,
                        label: "Project Commission",
                      },
                      {
                        color: "#0D9488", // teal-600
                        percentage:
                          Number(
                            analytics?.sources?.boostProfile?.percentage
                          ) || 0,
                        label: "Boost Profile",
                      },
                      {
                        color: "#FACC15", // yellow-400
                        percentage:
                          Number(analytics?.sources?.featuredJob?.percentage) ||
                          0,
                        label: "Featured Job/Service",
                      },
                      {
                        color: "#A3E635", // lime-400
                        percentage:
                          Number(
                            analytics?.sources?.subscriptions?.percentage
                          ) || 0,
                        label: "Subscription Plan",
                      },
                      {
                        color: "#14B8A6", // teal-500
                        percentage:
                          Number(
                            analytics?.sources?.connectPurchases?.percentage
                          ) || 0,
                        label: "Bid Purchase",
                      },
                    ]}
                    size={192}
                    strokeWidth={18}
                    trailColor="#E5E7EB"
                    showText={true}
                    textSize="text-2xl"
                    textValue={
                      analytics?.totalIncome
                        ? String(Number(analytics.totalIncome))
                        : "0"
                    }
                    textOffsetY="0"
                  />
                </div>
                <div className="w-full md:flex-1">
                  <EarningSource
                    name="Project Commission"
                    percentage={
                      Number(analytics?.sources?.commission?.percentage) || 0
                    }
                    color="bg-slate-700"
                  />
                  <EarningSource
                    name="Bid Purchase"
                    percentage={
                      Number(
                        analytics?.sources?.connectPurchases?.percentage
                      ) || 0
                    }
                    color="bg-teal-500"
                  />
                  <EarningSource
                    name="Subscription Plan"
                    percentage={
                      Number(analytics?.sources?.subscriptions?.percentage) || 0
                    }
                    color="bg-slate-700"
                  />
                  <EarningSource
                    name="Featured Job/Service"
                    percentage={
                      Number(analytics?.sources?.featuredJob?.percentage) || 0
                    }
                    color="bg-lime-500"
                  />
                  <EarningSource
                    name="Earning by user"
                    percentage={0}
                    color="bg-yellow-400"
                  />
                  <EarningSource
                    name="Boost Profile"
                    percentage={
                      Number(analytics?.sources?.boostProfile?.percentage) || 0
                    }
                    color="bg-teal-600"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-xl shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-800">
                  Profile Verification
                </CardTitle>
                <Link
                  href={"/admin/users?role=seller"}
                  className="flex items-center gap-3 px-0 text-sm text-teal-600 hover:text-teal-700"
                >
                  See All <ArrowUpRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
              <p className="flex items-center text-xs text-gray-500">
                <span className="mr-2 h-2 w-2 rounded-full bg-teal-500"></span>
                There are 5 profiles awaiting verification.
              </p>
            </CardHeader>
            <CardContent className="px-3 pt-0 md:px-4">
              {profileVerifications.length > 0 ? (
                profileVerifications
                  ?.slice(0, 5)
                  .map((profile: any, index: number) => (
                    <ProfileListItem key={index} {...profile} />
                  ))
              ) : (
                <div className="flex items-center justify-center py-6 text-gray-500">
                  No recent profiles found.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-xl shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-800">
                  Recent Dispute
                </CardTitle>
                <Link
                  href={"/admin/disputes?page=1&limit=10"}
                  className="flex items-center gap-3 px-0 text-sm text-teal-600 hover:text-teal-700"
                >
                  View All <ArrowUpRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
              <p className="flex items-center text-xs text-gray-500">
                <span className="mr-2 h-2 w-2 rounded-full bg-teal-500"></span>5
                new disputes have been added to your list.
              </p>
            </CardHeader>
            <CardContent className="px-3 pt-0 md:px-4">
              {recentDisputes.length > 0 ? (
                recentDisputes.slice(0, 5).map(
                  (
                    dispute: any,
                    index: number // Show first 3 for brevity
                  ) => <DisputeListItem key={index} {...dispute} />
                )
              ) : (
                <div className="flex items-center justify-center py-6 text-gray-500">
                  No recent disputes found.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Placeholder for the two bottom cards if needed, as per the full image structure */}
      {/* For now, the layout focuses on the main visible elements */}
    </div>
  );
}
