"use client";
import Card from "@/components/card";
import MenuCard from "@/components/menu-card";
import { useApp } from "@/components/providers/app-provider";
import { GetUserPointHistoryRespont, isErrorResponse } from "@/types/request";
import { useEffect, useState } from "react";

export default function Page() {
  const { backendClient, clientConfig, userProfile } = useApp();
  const [pointHistories, setpointHistories] = useState<
    GetUserPointHistoryRespont[]
  >([]);

  useEffect(() => {
    fechData();
  }, [userProfile?.userId]);

  const fechData = async () => {
    if (!userProfile?.userId) {
      return;
    }

    const pointHistories = await backendClient.getUserPointHistory(
      clientConfig.slug,
      userProfile?.userId,
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
        className="text-2xl mb-3"
        style={{ color: clientConfig.ui.primary_color }}
      >
        ประวัติการได้รับคะแนน
      </div>
      {pointHistories.map((pointHistory) => {
        return <MenuCard pointHistory={pointHistory} />;
      })}
    </div>
  );
}
