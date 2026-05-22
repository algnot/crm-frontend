import React, { useCallback, useEffect, useState } from "react";
import { useApp } from "./providers/app-provider";
import { GetUserPointHistoryRespont, isErrorResponse } from "@/types/request";
import MenuCard from "./menu-card";
import { Award } from "tabler-icons-react";

export default function History() {
  const { clientConfig, userProfile, backendClient } = useApp();
  const [pointHistories, setpointHistories] = useState<
    GetUserPointHistoryRespont[]
  >([]);

  useEffect(() => {
    const run = async () => {
      if (!userProfile?.userId) return;

      const pointHistories = await backendClient.getUserPointHistory(
        clientConfig.slug,
        userProfile.userId,
      );

      if (isErrorResponse(pointHistories)) {
        setpointHistories([]);
        return;
      }

      setpointHistories(pointHistories);
    };

    // call async function without causing synchronous state updates inside effect
    Promise.resolve().then(run);
  }, [backendClient, clientConfig.slug, userProfile]);
  return (
    <div>
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
    </div>
  );
}
