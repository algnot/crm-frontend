"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Profile from "@/components/profile";
import { GetUserPointHistoryRespont, isErrorResponse } from "@/types/request";
import { useApp } from "@/components/providers/app-provider";
import MenuCard from "@/components/menu-card";
import { Award } from "tabler-icons-react";

export default function Home() {
  const router = useRouter();
  const { userProfile, clientConfig, backendClient } = useApp();
  const searchParams = useSearchParams();
  const [pointHistories, setpointHistories] = useState<
    GetUserPointHistoryRespont[]
  >([]);

  useEffect(() => {
    const redeemCode = searchParams.get("redeem_code");
    const partner = searchParams.get("partner");

    if (redeemCode && partner) {
      router.replace(`/${partner}/redeem/${redeemCode}`);
      return;
    }
  }, [searchParams, router]);

  useEffect(() => {
    fechData();
  }, [userProfile?.userId]);

  const fechData = async () => {
    if (!userProfile?.userId) return;

    const pointHistories = await backendClient.getUserPointHistory(
      clientConfig.slug,
      userProfile.userId,
    );

    if (isErrorResponse(pointHistories)) {
      window.location.href = `/${clientConfig.slug}`;
      return;
    }

    setpointHistories(pointHistories);
  };

  const haveAds =
    clientConfig.ui.ui_custom_fields.filter(
      (custom_field) => custom_field.key == "ads",
    ).length > 0;

  const adsImage = clientConfig.ui.ui_custom_fields.find(
    (custom_field) => custom_field.key == "ads",
  );

  const adsAction = clientConfig.ui.ui_custom_fields.find(
    (custom_field) => custom_field.key == "ads_action",
  );

  return (
    <div className="h-dvh flex flex-col p-5">
      <Profile />

      {haveAds && (
        <img
          src={(adsImage?.value || "") as string}
          alt="ads"
          className="cursor-pointer rounded-md mt-5 shadow-md w-full h-auto"
          onClick={() => {
            if (adsAction) {
              window.location.href = adsAction.value;
            }
          }}
        />
      )}

      <div
        className="text-2xl my-5"
        style={{ color: clientConfig.ui.primary_color }}
      >
        ประวัติการได้รับคะแนน
      </div>

      {pointHistories.length > 0 &&
        pointHistories.map((pointHistory, index) => (
          <MenuCard key={index} pointHistory={pointHistory} />
        ))}

      {pointHistories.length === 0 && (
        <div className="py-8 flex flex-col items-center text-center gap-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: `${clientConfig.ui.text_gray_color}`,
              opacity: 0.7,
            }}
          >
            <Award size={30} color={clientConfig.ui.text_white_color} />
          </div>

          <div>
            <div
              className="text-lg font-semibold"
              style={{ color: clientConfig.ui.text_color }}
            >
              ยังไม่มีประวัติการได้รับคะแนน
            </div>

            <div
              className="text-sm text-gray-500 mt-1"
              style={{ color: clientConfig.ui.text_gray_color }}
            >
              เมื่อคุณได้รับคะแนน รายการจะแสดงที่นี่
            </div>
          </div>
        </div>
      )}
      <div className="p-20"></div>
    </div>
  );
}
