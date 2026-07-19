"use client";

import { Provider } from "react-redux";
import { store } from "@/store";
import { ErrorBoundary } from "@/components/organisms/ErrorBoundary";
import { ToastRuntime } from "@/components/organisms/ToastRuntime";

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        {children}
        <ToastRuntime />
      </ErrorBoundary>
    </Provider>
  );
}

