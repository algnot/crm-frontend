"use client";
import { useApp } from "@/components/providers/app-provider";
import { IconChevronLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function Warranty() {
  const { clientConfig } = useApp();
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col px-5 pb-10">
      <div className="flex items-center pt-8 pb-6 gap-4">
        <button
          type="button"
          aria-label="Back"
          onClick={() => router.push(`/${clientConfig.slug}`)}
          className="rounded-full border border-white/12 bg-black/45 p-2 text-white shadow-lg backdrop-blur-sm shrink-0"
        >
          <IconChevronLeft size={24} />
        </button>
        <p
          className="font-bodoni text-xl font-medium"
          style={{ color: clientConfig.ui.text_color }}
        >
          ลงทะเบียนรับประกันสินค้า
        </p>
      </div>
    </div>
  );
}
