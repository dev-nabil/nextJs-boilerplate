"use client";

import { store } from "@/store";
import { Provider as ReduxProvider } from "react-redux";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      {/* <AuthProvider></AuthProvider> */}
      {children}
    </ReduxProvider>
  );
}
