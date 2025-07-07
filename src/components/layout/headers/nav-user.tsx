"use client";

import Loader from "@/components/custom/loader";
import { useAuth } from "@/hooks/use-auth";
import { userLogout } from "@/store/features/auth/authSlice";
import { useLogoutMutation } from "@/store/features/user/userApi";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useDispatch } from "react-redux";

export function NavUser() {
  const { user } = useAuth();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();
  const [logout, { isLoading }] = useLogoutMutation();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      // Then call the logout API
      await logout(null)
        .unwrap()
        .then(() => {
          dispatch(userLogout());
          replace("/");
          window.location.reload();
        });

      // // Finally navigate after both operations are complete
      // startTransition(() => {
      //   replace("/auth/login")
      // })
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return <div className="flex items-center gap-4"></div>;
}
