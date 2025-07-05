"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

export default async function SearchTopPage() {
  const searchParams = await useSearchParams();
  const query = searchParams.get("q") || "";

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Search Results for: {query}</h1>

    </div>
  );
}
