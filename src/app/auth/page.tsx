"use client";

import { Suspense } from "react";
import AuthPage from "./AuthPageInner";


export default function Page() {
  return (
    <Suspense>
      <AuthPage />
    </Suspense>
  );
}
