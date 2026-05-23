"use client";
import Header from "@/components/Header";
import PointCard from "@/components/PointCard";
import TeirCard from "@/components/TeirCard";
import News from "@/components/News";
import Coupon from "@/components/Coupon";

export default function Home() {
  return (
    <div className="h-dvh pb-20">
      <Header />
      <PointCard />
      <TeirCard />
      <News />
      <Coupon />

      <div className="p-15"></div>
    </div>
  );
}
