"use client";
import Card from "@/components/card";
import MenuCard from "@/components/menu-card";
import { useApp } from "@/components/providers/app-provider";
import { GetUserPointHistoryRespont, isErrorResponse } from "@/types/request";
import { useEffect, useState } from "react";
import { Award } from "tabler-icons-react";

export default function Page() {
  const { backendClient, clientConfig, userProfile } = useApp();

  const [pointHistories, setpointHistories] = useState<
    GetUserPointHistoryRespont[]
  >([]);

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

  return (
    <div className="px-5 pt-4">
      <div
        className="text-2xl mb-4 font-semibold"
        style={{ color: clientConfig.ui.primary_color }}
      >
        ประวัติการได้รับคะแนน
      </div>

      {pointHistories.length > 0 &&
        pointHistories.map((pointHistory, index) => (
          <MenuCard key={index} pointHistory={pointHistory} />
        ))}

      {pointHistories.length === 0 && (
        <div className="py-12 flex flex-col items-center text-center gap-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: `${clientConfig.ui.primary_color}15`,
            }}
          >
            <Award size={30} color={clientConfig.ui.primary_color} />
          </div>

          <div>
            <div className="text-lg font-semibold text-gray-700">
              ยังไม่มีประวัติการได้รับคะแนน
            </div>

            <div className="text-sm text-gray-500 mt-1">
              เมื่อคุณได้รับคะแนน รายการจะแสดงที่นี่
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
