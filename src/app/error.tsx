"use client";

import ErrorPage from "../components/custom/error-page";

interface ErrorPageProps {
  error: Error;
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorPageProps) {
  return (
    <ErrorPage
      message={
        error.message ||
        "We’re experiencing some technical difficulties right now. Please try again later, or contact support if the problem persists."
      }
      backPage="Home"
      backRoute="/"
      reset={reset}
    />
  );
}
