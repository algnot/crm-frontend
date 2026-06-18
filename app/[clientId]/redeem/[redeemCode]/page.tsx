"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import Button from "@/components/button";
import { useApp } from "@/components/providers/app-provider";
import { isErrorResponse, Redeem } from "@/types/request";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft } from "tabler-icons-react";
import { IconGift } from "@tabler/icons-react";

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const {
    backendClient,
    clientConfig,
    userProfile,
    setIsShowNavbar,
    openAlert,
  } = useApp();
  const redeemCode = Array.isArray(params.redeemCode)
    ? params.redeemCode[0]
    : params.redeemCode;
  const [redeemDetail, setRedeemDetail] = useState<Redeem>();

  useEffect(() => {
    Promise.resolve().then(() => setIsShowNavbar(false));
    return () => {
      setIsShowNavbar(true);
    };
  }, [setIsShowNavbar]);

  const fetchData = useCallback(async () => {
    if (!redeemCode) return;

    const redeemDetail = await backendClient.getRedeemDetail(
      clientConfig.slug,
      redeemCode,
    );
    if (isErrorResponse(redeemDetail)) {
      window.location.href = `/${clientConfig.slug}`;
      return;
    }
    if (redeemDetail) {
      setRedeemDetail(redeemDetail);
    }
  }, [backendClient, clientConfig.slug, redeemCode]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const onReedeem = async () => {
    if (!redeemCode || !userProfile?.userId) return;

    const response = await backendClient.redeemCode(
      clientConfig.slug,
      redeemCode,
      userProfile?.userId,
    );

    if (isErrorResponse(response)) {
      openAlert({
        title: "เกิดข้อผิดพลาด",
        message: response.message,
      });
      return;
    }

    openAlert({
      title: "สำเร็จ",
      message: "สะสมคะแนนสำเร็จแล้ว!",
    });
    router.push(`/${clientConfig.slug}`);
  };

  const typeLabel =
    redeemDetail?.type === "burn"
      ? "ใช้แต้ม"
      : redeemDetail?.type === "tranfer"
        ? "โอนแต้ม"
        : "สะสมแต้ม";

  return (
    <div
      className="min-h-screen relative px-4.5 pt-4.5 pb-28"
      style={{
        backgroundColor: clientConfig.ui.background_color,
        color: clientConfig.ui.text_color,
      }}
    >
      {/* Back Button */}
      <button
        onClick={() => router.push(`/${clientConfig.slug}`)}
        className="rounded-full p-2 shadow-md cursor-pointer"
        style={{ backgroundColor: clientConfig.ui.surface_color }}
      >
        <ArrowLeft size={22} color={clientConfig.ui.text_color} />
      </button>

      <div
        className="mt-4 h-45 w-full rounded-2xl flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: clientConfig.ui.surface_color }}
      >
        {redeemDetail?.reward_coupon.image_url ? (
          <img
            src={redeemDetail.reward_coupon.image_url}
            alt="redeem"
            className="w-full h-full object-cover"
          />
        ) : (
          <IconGift size={64} color={clientConfig.ui.text_gray_color} />
        )}
      </div>

      <div className="mt-5">
        <div
          className="text-[32px] font-medium font-bodoni"
          style={{ color: clientConfig.ui.text_color }}
        >
          {redeemDetail?.name || "—"}
        </div>

        <p
          className="mt-1 text-[12px] font-mono"
          style={{ color: clientConfig.ui.text_gray_color }}
        >
          {redeemDetail?.code}
        </p>

        {/* Details Card */}
        <div
          className="mt-5 rounded-3xl border-[0.5px]"
          style={{
            backgroundColor: clientConfig.ui.surface_color,
            borderColor: `color-mix(in srgb, ${clientConfig.ui.text_gray_color} 80%, transparent)`,
          }}
        >
          {/* Type row */}
          <div className="p-5 flex items-center justify-between text-[13px]">
            <p style={{ color: clientConfig.ui.text_gray_color }}>คะแนน</p>
            <p style={{ color: clientConfig.ui.text_color }}>
              {redeemDetail?.value.toLocaleString()}{" "}
              {redeemDetail?.currency.name}
            </p>
          </div>

          {/* Points row */}
          <div
            className="p-5 flex items-center justify-between border-t-[0.5px] text-[13px]"
            style={{
              borderColor: `color-mix(in srgb, ${clientConfig.ui.text_gray_color} 80%, transparent)`,
            }}
          >
            <p style={{ color: clientConfig.ui.text_gray_color }}>รางวัล</p>
            <p style={{ color: clientConfig.ui.text_color }}>
              {redeemDetail?.reward_coupon.name}
            </p>
          </div>

          {/* Reward coupon row */}
          {redeemDetail?.reward_coupon?.name && (
            <div
              className="p-5 flex items-center justify-between border-t-[0.5px] text-[13px]"
              style={{
                borderColor: `color-mix(in srgb, ${clientConfig.ui.text_gray_color} 80%, transparent)`,
              }}
            >
              <p style={{ color: clientConfig.ui.text_gray_color }}>
                มูลค่ารางวัล
              </p>
              <p style={{ color: clientConfig.ui.text_color }}>
                {redeemDetail.reward_coupon.value}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Button */}
      <div className="fixed bottom-0 left-0 z-30 w-full p-4">
        <Button text="สะสมคะแนน" onClick={onReedeem} />
      </div>
    </div>
  );
}
