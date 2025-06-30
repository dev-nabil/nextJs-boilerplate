"use client";

import { isRouteMatch, PUBLIC_ROUTES, SHARED_ROUTES } from "@/lib/route-access";
import socket from "@/lib/socket";
import { useLazyGetOwnProfileQuery } from "@/store/features/user/userApi";

import { usePathname, useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";

const ROLE_BASE_PATHS: Record<string, string> = {
  buyer: "/buyer",
  seller: "/seller",
  admin: "/admin",
};

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  const pathname = usePathname();
  const router = useRouter();

  const isPublicPath = isRouteMatch(pathname, PUBLIC_ROUTES);
  const isCommonAuthPath = isRouteMatch(pathname, SHARED_ROUTES);

  const [loading, setLoading] = useState(true);
  const [mutOwnProfile] = useLazyGetOwnProfileQuery();

  useEffect(() => {
    // Skip auth check for public/common public routes
    if (isPublicPath) {
      setLoading(false);
      return;
    }

    const checkAuth = async () => {
      try {
        const res = await mutOwnProfile(null).unwrap();

        if (res?.id && !socket.connected) {
          socket.connect();
        }

        const role = res?.user?.role?.name;
        const roleBase = ROLE_BASE_PATHS[role];

        if (!roleBase) {
          router.replace("/");
          return;
        }

        const hasAccessToRoleRoute = pathname.startsWith(roleBase);
        const hasAccessToCommonRoute = isCommonAuthPath;

        if (!hasAccessToRoleRoute && !hasAccessToCommonRoute) {
          router.replace(role === "seller" ? "/seller/find-work" : roleBase);
        }
      } catch {
        router.replace("/auth/login?redirect=" + encodeURIComponent(pathname));
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname, isPublicPath, isCommonAuthPath, mutOwnProfile, router]);

  if (loading) return <></>;

  return <>{children}</>;
}
