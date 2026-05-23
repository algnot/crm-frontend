import { GetUserPointRespont, isErrorResponse } from "@/types/request";
import React, { useEffect, useState, useCallback } from "react";
import { useApp } from "./providers/app-provider";
import { IconScan } from "@tabler/icons-react";
import { openScanner, closeScanner } from "@/util/qr-scanner";

export default function PointCard() {
  const { userProfile, clientConfig, backendClient, setUserPoint } = useApp();

  const [mainPoint, setMainPoint] = useState<GetUserPointRespont>({
    currency: {
      id: 0,
      name: "Point",
      is_default: true,
    },
    balance: 0,
    burn: 0,
    earn: 0,
    transfer: 0,
  });

  const fetchData = useCallback(async () => {
    if (!clientConfig.slug || !userProfile?.userId) return;

    const points = await backendClient.getUserPoint(
      clientConfig.slug,
      userProfile.userId,
    );

    if (isErrorResponse(points)) {
      setUserPoint([]);
      return;
    }
    setUserPoint(points);

    const mainPoint = points.find((point) => point.currency.is_default);
    if (mainPoint) setMainPoint(mainPoint);
  }, [clientConfig.slug, userProfile?.userId, backendClient, setUserPoint]);

  useEffect(() => {
    Promise.resolve().then(fetchData);
  }, [fetchData]);

  const handleQRCode = async (qrText: string) => {
    try {
      closeScanner();

      const isUrl = /^https?:\/\/.+/i.test(qrText);

      if (isUrl) {
        window.location.href = qrText;
        return;
      }

      alert(`QR Code:\n${qrText}`);
      await fetchData();
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาด");
    }
  };
  return (
    <section
      className="relative mx-4.5 mb-5.5 rounded-[22px] pt-5.5 px-5.5 pb-5 overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${clientConfig.ui.primary_color}, ${clientConfig.ui.secondary_color})`,
        boxShadow: `10px 10px 40px -10px color-mix(in oklch, ${clientConfig.ui.secondary_color} 60%, transparent), inset 0 1px 0 rgba(255,255,255,0.18)`,
      }}
    >
      <div
        className="absolute w-[70%] h-[140%] top-[-40%] right-[-20%] blur-lg"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.25), transparent 60%)",
        }}
      ></div>
      <p
        style={{ color: clientConfig.ui.text_white_color }}
        className="text-xs font-medium"
      >
        พ้อยคงเหลือ
      </p>
      <p className="text-white mt-1">
        <span className="text-5xl font-semibold">
          {mainPoint.balance.toLocaleString()}{" "}
        </span>
        <span>PTS</span>
      </p>
      <div className="pt-3 flex justify-between border-t border-white text-white">
        <p>Lifetime · xxxx</p>
        <div
          className="cursor-pointer flex items-center gap-2.5 border rounded-full px-3 py-1 bg-[rgba(255,255,255,0.18)] z-1"
          onClick={() =>
            openScanner({
              onResult: handleQRCode,
              onClose: async () => {
                await fetchData();
              },
              primaryColor: clientConfig.ui.primary_color,
              secondaryColor: clientConfig.ui.secondary_color,
              textWhiteColor: clientConfig.ui.text_white_color,
            })
          }
        >
          <IconScan size={16} /> เก็บแต้ม
        </div>
      </div>
    </section>
  );
}
