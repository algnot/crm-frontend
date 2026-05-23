import React, { use, useEffect, useState } from "react";
import { useApp } from "./providers/app-provider";
import {
  GetUserPointHistoryRespont,
  GetUserPointRespont,
  isErrorResponse,
} from "@/types/request";
import MenuCard from "./menu-card";
import { Award } from "tabler-icons-react";

export default function History() {
  const { clientConfig, userProfile, backendClient } = useApp();
  const [pointHistories, setpointHistories] = useState<
    GetUserPointHistoryRespont[]
  >([]);

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

  const fetchData = async () => {
    if (!clientConfig.slug || !userProfile?.userId) return;

    const points = await backendClient.getUserPoint(
      clientConfig.slug,
      userProfile.userId,
    );

    if (isErrorResponse(points)) {
      return;
    }

    const mainPoint = points.find((point) => point.currency.is_default);
    if (mainPoint) setMainPoint(mainPoint);
  };

  useEffect(() => {
    fetchData();
  }, [clientConfig.slug, userProfile?.userId]);

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
        className="text-3xl leading-none font-medium mt-5 mb-2"
        style={{ color: clientConfig.ui.text_color }}
      >
        ประวัติการได้รับคะแนน
      </div>

      <div
        className="rounded-[18px] border-[0.5px] border-[rgba(255,255,255,0.08)] p-4.5 mb-4.5 grid grid-cols-3"
        style={{
          background: clientConfig.ui.ui_custom_fields.find(
            (field) => field.key === "surface_color",
          )?.value,
        }}
      >
        <div className="flex flex-col items-center justify-between border-r-[0.5px] border-[rgba(255,255,255,0.08)]">
          <p
            className=""
            style={{
              color: clientConfig.ui.text_gray_color,
            }}
          >
            รับ
          </p>
          <p
            className="text-3xl font-medium"
            style={{
              color: clientConfig.ui.text_success_color,
            }}
          >
            +{mainPoint.earn.toLocaleString()}
          </p>
        </div>
        <div className="flex flex-col items-center justify-between border-r-[0.5px] border-[rgba(255,255,255,0.08)]">
          <p
            className=""
            style={{
              color: clientConfig.ui.text_gray_color,
            }}
          >
            ใช้
          </p>
          <p
            className="text-3xl font-medium"
            style={{
              color: clientConfig.ui.text_error_color,
            }}
          >
            -{mainPoint.burn.toLocaleString()}
          </p>
        </div>
        <div className="flex flex-col items-center justify-between">
          <p
            className=""
            style={{
              color: clientConfig.ui.text_gray_color,
            }}
          >
            คงเหลือ
          </p>
          <div
            className="text-3xl font-medium"
            style={{
              color: clientConfig.ui.text_color,
            }}
          >
            {mainPoint.balance.toLocaleString()}
          </div>
        </div>
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
