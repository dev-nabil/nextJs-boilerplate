"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/use-auth";
import socket from "@/lib/socket";
import { calculateProfileCompletion, formatCurrency } from "@/lib/utils";
import { buyerAndSellerRoutes } from "@/routes/routes";
import { userLogout } from "@/store/features/auth/authSlice";
import { useLazyGetChatQuery } from "@/store/features/chat/chatApi";
import {
  useLogoutMutation,
  useUpdateRoleMutation,
} from "@/store/features/user/userApi";
import type { IChat } from "@/types";
import {
  ArrowLeftRight,
  CreditCard,
  LogOut,
  Mail,
  MessageSquare,
  Settings,
  Shield,
  ShoppingBag,
  Store,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import ProfileRatio from "../shared/ProfileRatio";
import { Badge } from "../ui/badge";
import NotificationDropdown from "./notification/NotificatonDropdown";

export default function UserNav() {
  const { user } = useAuth();
  const { replace, push } = useRouter();
  const [isPending] = useTransition();
  const [logout, { isLoading }] = useLogoutMutation();
  const [getChats] = useLazyGetChatQuery();
  const chats = useSelector((state: any) => state.chatStore.chats);
  const currentUser = useSelector((state: any) => state.auth.user);
  const [isUnseen, setIsUnseen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const pathname = usePathname();
  const [updateRole, { isLoading: updateRoleLoading }] =
    useUpdateRoleMutation();
  const completionRate = calculateProfileCompletion(user);
  const dispatch = useDispatch();

  const role = pathname.split("/")[1]; // Extract the first part of the URL (e.g., 'seller' or 'buyer')
  const currentRole = user?.user?.role?.name;
  const isSeller = currentRole === "seller";

  const handleLogout = async () => {
    try {
      // Then call the logout API
      await logout(null)
        .unwrap()
        .then(() => {
          toast.success("logout Successfully");
          dispatch(userLogout());
          replace("auth/login");
          window.location.reload();
        });
    } catch (err) {
      console.error("Logout error:", err);
      // You might want to show an error toast here
    }
  };

  const handleRoleSwitch = async () => {
    setIsSwitching(true);
    try {
      const newRole = isSeller ? "buyer" : "seller";
      const res: any = await updateRole({ role: newRole });
      if (res?.data?.message === "Role switch done") {
        toast.success(`Switched to ${newRole} mode`);
        window.location.reload();
      }
    } catch (error) {
      toast.error("Failed to switch role");
      console.error("Role switch error:", error);
    } finally {
      setIsSwitching(false);
    }
  };

  useEffect(() => {
    // Only fetch chats if we're not on the chat page
    if (!pathname.startsWith("/chat")) {
      getChats({}).unwrap();
    }

    return () => {
      socket.off("seen");
    };
  }, []);

  useEffect(() => {
    if (!pathname.startsWith("/chat")) {
      const isUnseen = chats?.find((chat: IChat) => {
        return (
          chat.lastMessage &&
          !chat.seens?.some((user: any) => user.id === currentUser?.userId) &&
          chat.lastMessage?.authorId !== currentUser?.userId
        );
      });
      setIsUnseen(!!isUnseen);
    }
  }, [chats]);

  return (
    <div className="flex items-center justify-end gap-5">
      <div className="flex items-center gap-1">
        <Link
          href={"/chat"}
          className="relative rounded-full p-2 hover:bg-gray-100"
        >
          <Mail className="h-5 w-5 text-gray-600" />
          {isUnseen && (
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          )}
        </Link>

        {/* <button className="rounded-full p-2 hover:bg-gray-100"> */}
        <NotificationDropdown />
        {/* </button> */}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="border-border hover:bg-accent relative h-10 w-10 rounded-full border"
          >
            <Avatar className="h-9 w-9">
              <AvatarImage
                src={user?.user?.avatar || ""}
                alt={user?.user?.name || ""}
                className="object-cover"
              />
              <AvatarFallback className="bg-primary/10 text-primary">
                {user?.user?.name
                  ? user?.user?.name.charAt(0).toUpperCase()
                  : ""}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-80 drop-shadow-2xl" align="end">
          <div className="flex items-center justify-between gap-2 p-4">
            <div className="flex items-center gap-3">
              <Avatar className="border-border h-12 w-12 border">
                <AvatarImage
                  src={user?.user?.avatar || ""}
                  alt={user?.user?.name || ""}
                  className="h-10 w-10 object-cover"
                />
                <AvatarFallback className="bg-primary/10 text-primary text-lg">
                  {user?.user?.name
                    ? user?.user?.name.charAt(0).toUpperCase()
                    : ""}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h4 className="text-sm leading-none font-semibold">
                  {user?.user?.name || ""}
                </h4>
                <p className="text-muted-foreground text-xs">
                  {user?.user?.email}
                </p>
                <div className="flex items-center gap-1.5">
                  {user?.user?.role?.name && (
                    <Badge
                      variant="outline"
                      className="px-1 text-[10px] font-normal capitalize"
                    >
                      {user.user.role.name}
                    </Badge>
                  )}
                  {user?.verified ? (
                    <Badge className="border-green-500/20 bg-green-500/10 px-1 text-[10px] font-normal text-green-500">
                      Verified
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="border-amber-500/20 bg-amber-500/10 px-1 text-[10px] font-normal text-amber-500"
                    >
                      Unverified
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {user?.user?.role?.name && (
            <div className="px-4 pb-3">
              <div className="grid grid-cols-2 gap-4 text-sm text-white">
                <div className="bg-primary space-y-1 rounded-md p-2">
                  <p className="text-xs">
                    {user?.user?.role?.name === "seller"
                      ? "Available Balance"
                      : "Account Balance"}
                  </p>
                  <p className="font-medium">
                    {formatCurrency(
                      user?.user?.role?.name === "seller"
                        ? Number(user?.availableAmount || 0)
                        : Number(user?.accountBalance || 0)
                    )}
                  </p>
                </div>
                <div className="bg-primary space-y-1 rounded-md p-2">
                  <p className="text-xs text-white">
                    {" "}
                    {user?.user?.role?.name === "seller"
                      ? "Escrow Amount"
                      : "Total Spent"}
                  </p>
                  <p className="font-medium">
                    {formatCurrency(
                      Number(
                        user?.user?.role?.name === "seller"
                          ? Number(user.escrowAmount) || 0
                          : Number(user?.totalSpent) || 0
                      )
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="px-4 pb-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  Profile Completion
                </span>
                <span className="font-medium">{completionRate}%</span>
              </div>
              <ProfileRatio isValueShow={false} completeRate={completionRate} />
            </div>
          </div>
          {/* Role Switch Section */}
          <div className="mx-0 mb-3 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {isSeller ? (
                    <Store className="text-primary h-4 w-4" />
                  ) : (
                    <ShoppingBag className="text-primary h-4 w-4" />
                  )}
                  <Label htmlFor="role-switch" className="text-sm font-medium">
                    {isSeller ? "Seller Mode" : "Buyer Mode"}
                  </Label>
                </div>
                <ArrowLeftRight className="text-muted-foreground h-3 w-3" />
              </div>
              <div className="flex items-center gap-2">
                {!isSwitching && (
                  <Switch
                    id="role-switch"
                    checked={isSeller}
                    onCheckedChange={handleRoleSwitch}
                    disabled={isSwitching}
                    className="data-[state=checked]:bg-primary"
                  />
                )}
                {isSwitching && (
                  <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                )}
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-700">
              {isSeller
                ? "Switch to buyer mode to browse and purchase items"
                : "Switch to seller mode to list and manage your products"}
            </p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {user.user.role.name === "seller" && (
              <Link href={"/seller/profile"}>
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  My Profile
                </DropdownMenuItem>
              </Link>
            )}
            <DropdownMenuItem className="cursor-pointer">
              <Link
                href={buyerAndSellerRoutes.chat}
                className="flex w-full gap-2"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                <span>Messages</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Link
                href={buyerAndSellerRoutes.setting(
                  user?.user?.role?.name as any,
                  `active=${role === "seller" ? "transactions" : "wallet"}`
                )}
                className="flex w-full gap-2"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Payments</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            {user?.verificationStatus && (
              <Link
                href={`/${user?.user?.role?.name}/settings?active=verification`}
              >
                <DropdownMenuItem className="group cursor-pointer">
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Verification</span>
                  <Badge
                    variant="outline"
                    className="group-hover:text-primary ml-auto transform text-[10px] capitalize duration-300"
                  >
                    {user?.verificationStatus?.replace(/_/g, " ")}
                  </Badge>
                </DropdownMenuItem>
              </Link>
            )}
            <Link
              href={buyerAndSellerRoutes.setting(
                user?.user?.role?.name === "seller" ? "seller" : "buyer"
              )}
              className="flex w-full gap-2"
            >
              <DropdownMenuItem className="w-full cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            disabled={isLoading || isPending}
            className="text-destructive focus:text-destructive cursor-pointer"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>{isLoading || isPending ? "Logging out..." : "Log out"}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
