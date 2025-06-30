// hooks/socketConnectApi.ts
"use client";
import socket from "@/lib/socket";
import { useEffect } from "react";

export function useSocketRevalidate(refetch: () => void = () => {}) {
  useEffect(() => {
    const handleRevalidate = (data: string) => {
      if (data === "notification") {
        refetch();
      }
    };

    socket.on("revalidate", handleRevalidate);

    return () => {
      socket.off("revalidate", handleRevalidate);
      socket.disconnect();
    };
  }, [refetch]);

  return true;
}
