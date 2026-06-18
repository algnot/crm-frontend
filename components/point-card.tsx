import { GetUserPointRespont, isErrorResponse } from "@/types/request";
import React, { useEffect, useState, useCallback } from "react";
import { useApp } from "./providers/app-provider";

export default function PointCard() {
  const {
    userProfile,
    clientConfig,
    backendClient,
    setUserPoint,
    appUserProfile,
    closeScanner,
    openAlert,
  } = useApp();

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
  }, [clientConfig.slug, userProfile, backendClient, setUserPoint]);

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

      await openAlert({
        title: "QR Code",
        message: qrText,
      });
      await fetchData();
    } catch (err) {
      console.error(err);
      await openAlert({
        title: "เกิดข้อผิดพลาด",
        message: "เกิดข้อผิดพลาด",
      });
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
      <div className="flex justify-between items-center">
        <p
          style={{ color: clientConfig.ui.text_white_color }}
          className="text-sm font-medium"
        >
          พ้อยคงเหลือ
        </p>
        <div
          className="flex items-center gap-1.25 rounded-full px-2 py-0.5 text-[10px] font-bold"
          style={{
            color: appUserProfile?.tier.color,
            border: `1px solid ${appUserProfile?.tier.color}`,
          }}
        >
          <div
            className="h-1.25 w-1.25 rounded-full"
            style={{
              backgroundColor: appUserProfile?.tier.color,
            }}
          ></div>
          {appUserProfile?.tier.name}
        </div>
      </div>
      <p className="text-white mt-1">
        <p className="text-[54px] font-semibold font-bodoni">
          {mainPoint.balance.toLocaleString()}{" "}
        </p>
        <p className="text-[11px] font-semibold tracking-[0.16em] uppercase -mt-4">
          {mainPoint.currency.name}
        </p>
      </p>
      {/* <div className="pt-3 flex justify-between border-t-[0.5px] border-[rgba(255,255,255,0.18)] text-white"> */}
      {/* <p className="text-[10.5px] font-mono">Lifetime · xxxx</p> */}
      {/* <button
          className="h-7 font-mono cursor-pointer flex items-center gap-2.5 border-[0.5px] rounded-full px-3 py-1 bg-[rgba(255,255,255,0.18)] z-1"
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
          <IconScan size={16} />{" "}
          <p className="text-xs font-semibold">เก็บแต้ม</p>
        </button> */}
      {/* </div> */}
    </section>
  );
}
