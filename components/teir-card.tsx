import React from "react";
import ProgressBar from "./progress-bar";
import { useApp } from "./providers/app-provider";

export default function TeirCard() {
  const { clientConfig } = useApp();

  return (
    <section
      className="mx-4.5 mb-5.5 rounded-[18px] pt-4 px-4.5 pb-3.5 border-[0.5px]"
      style={{
        background: clientConfig.ui.surface_color,
        color: clientConfig.ui.text_color,
        borderColor: `color-mix(in srgb, ${clientConfig.ui.text_gray_color} 80%, transparent)`,
      }}
    >
      <div className="flex justify-between mb-2.5">
        <p>ความคืบหน้า · Gold → Platinum</p>
        <p className="text-xl">1,250 / 3,000</p>
      </div>
      <ProgressBar
        value={1250}
        max={3000}
        barClassName="bg-red-600"
        showValue={false}
      />
      <p className="mt-2.5">อีก 1,750 แต้มก็จะเป็น Platinum แล้ว ✦</p>
    </section>
  );
}
