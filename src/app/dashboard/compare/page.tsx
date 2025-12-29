"use client";

import { Suspense } from "react";
import ComparePageInner from "./ComparePageInner";


export default function Page() {
  return (
    <Suspense>
      <ComparePageInner />
    </Suspense>
  );
}
