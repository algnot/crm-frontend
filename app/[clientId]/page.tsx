"use client";

import PointCard from "@/components/point-card";
import TeirCard from "@/components/teir-card";
import CouponSection from "@/components/coupon-section";
import NewsSection from "@/components/news-section";
import HeaderSection from "@/components/header-section";

export default function Home() {
  return (
    <div className="h-dvh pb-20">
      <HeaderSection />
      <PointCard />
      <TeirCard />
      <NewsSection />
      <CouponSection />

      <div className="p-15"></div>
    </div>
  );
}
