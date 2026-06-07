import React from "react";
import ProgressBar from "./progress-bar";
import { useApp } from "./providers/app-provider";

export default function TierCard() {
  const { clientConfig, userPoint, appUserProfile } = useApp();

  const mainPoint = userPoint.find((point) => point.currency.is_default);
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
        <p>
          ความคืบหน้า · {appUserProfile?.tier?.name || "Tier Mock"} → Platinum
          Mock
        </p>
        <p className="text-xl">
          {mainPoint?.balance.toLocaleString() || 0} /{" "}
          {appUserProfile?.tier?.max_spending?.toLocaleString() || 0}{" "}
        </p>
      </div>
      <ProgressBar
        value={mainPoint?.balance || 0}
        max={appUserProfile?.tier?.max_spending || 0}
        barClassName="bg-red-600"
        showValue={false}
      />
      <p className="mt-2.5">mock อีก 1,750 แต้มก็จะเป็น Platinum แล้ว ✦</p>
    </section>
  );
}
