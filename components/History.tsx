import React, { useEffect, useState } from "react";
import { useApp } from "./providers/app-provider";
import {
  GetUserPointHistoryRespont,
  GetUserPointRespont,
  isErrorResponse,
} from "@/types/request";
import MenuCard from "./menu-card";
import ChipButton from "./ChipButton";
import { Award } from "tabler-icons-react";

export default function History() {
  const { clientConfig, userProfile, backendClient } = useApp();

  const [selectedTab, setSelectedTab] = useState<
    "all" | "earn" | "burn" | "tranfer" | "expire"
  >("all");

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

  useEffect(() => {
    const loadPoints = async () => {
      if (!clientConfig.slug || !userProfile?.userId) return;

      const points = await backendClient.getUserPoint(
        clientConfig.slug,
        userProfile.userId,
      );

      if (isErrorResponse(points)) return;

      const main = points.find((p) => p.currency.is_default);
      if (main) setMainPoint(main);
    };

    Promise.resolve().then(loadPoints);
  }, [backendClient, clientConfig.slug, userProfile]);

  useEffect(() => {
    const loadHistories = async () => {
      if (!clientConfig.slug || !userProfile?.userId) return;

      const histories = await backendClient.getUserPointHistory(
        clientConfig.slug,
        userProfile.userId,
      );

      if (isErrorResponse(histories)) {
        setpointHistories([]);
        return;
      }

      setpointHistories(histories);
    };

    Promise.resolve().then(loadHistories);
  }, [backendClient, clientConfig.slug, userProfile]);

  const now = new Date();

  const isExpired = (expirationDate?: string) => {
    if (!expirationDate) return false;

    const date = new Date(expirationDate.replace(" ", "T") + "Z");

    return !Number.isNaN(date.getTime()) && date < now;
  };

  const displayHistories =
    selectedTab === "all"
      ? pointHistories
      : selectedTab === "expire"
        ? pointHistories.filter((ph) => isExpired(ph.expiration_date))
        : pointHistories.filter((ph) => ph.type === selectedTab);

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

      <div className="flex gap-2 mb-4.5">
        <ChipButton
          label="ทั้งหมด"
          selected={selectedTab === "all"}
          onSelect={() => setSelectedTab("all")}
        />
        <ChipButton
          label="ได้มา"
          selected={selectedTab === "earn"}
          onSelect={() => setSelectedTab("earn")}
        />
        <ChipButton
          label="ใช้ไป"
          selected={selectedTab === "burn"}
          onSelect={() => setSelectedTab("burn")}
        />
        <ChipButton
          label="โอน"
          selected={selectedTab === "tranfer"}
          onSelect={() => setSelectedTab("tranfer")}
        />
        <ChipButton
          label="หมดอายุ"
          selected={selectedTab === "expire"}
          onSelect={() => setSelectedTab("expire")}
        />
      </div>

      {displayHistories.length > 0 &&
        displayHistories.map((pointHistory, index) => (
          <MenuCard key={index} pointHistory={pointHistory} />
        ))}

      {displayHistories.length === 0 && (
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
