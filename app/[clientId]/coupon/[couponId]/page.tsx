"use client";

/* eslint-disable react-hooks/set-state-in-effect */

/* eslint-disable @next/next/no-img-element */

import { useApp } from "@/components/providers/app-provider";
import { CouponType, isErrorResponse } from "@/types/request";
import { ArrowLeft } from "tabler-icons-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import Button from "@/components/button";
import { formatDate } from "@/util/format-date";
import { IconMoodSadFilled, IconTicket } from "@tabler/icons-react";

export default function Page() {
  const params = useParams();
  const router = useRouter();

  const {
    backendClient,
    clientConfig,
    setIsShowNavbar,
    userPoint,
    userProfile,
    setUserPoint,
    openAlert,
  } = useApp();

  const couponId = Array.isArray(params.couponId)
    ? params.couponId[0]
    : params.couponId;

  const [coupon, setCoupon] = useState<CouponType>();

  const fetchData = useCallback(async () => {
    if (!couponId || !userProfile) return;

    const res = await backendClient.getCouponDetailById(
      clientConfig.slug,
      couponId,
    );

    if (isErrorResponse(res)) return;

    setCoupon(res);

    const userPoint = await backendClient.getUserPoint(
      clientConfig.slug,
      userProfile?.userId,
    );
    if (isErrorResponse(userPoint)) return;

    setUserPoint(userPoint);
  }, [backendClient, clientConfig.slug, couponId, setUserPoint, userProfile]);

  useEffect(() => {
    Promise.resolve().then(() => setIsShowNavbar(false));

    return () => {
      setIsShowNavbar(true);
    };
  }, [setIsShowNavbar]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const currentPoint = useMemo(() => {
    return (
      userPoint.find((point) => point.currency.id === coupon?.currency.id)
        ?.balance || 0
    );
  }, [userPoint, coupon]);

  const redeemCoupon = async () => {
    if (!coupon || !clientConfig || !userProfile) return;

    const res = await backendClient.redeemCoupon(
      clientConfig.slug,
      coupon.id,
      userProfile?.userId,
    );

    if (isErrorResponse(res)) {
      openAlert({
        title: "แลกรับสิทธิ์ไม่สำเร็จ",
        message: res.message,
        icon: <IconMoodSadFilled />,
      });
      return;
    }

    openAlert({
      title: "แลกรับสิทธิ์สำเร็จ",
      message: `คุณได้แลกรับสิทธิ์ ${coupon.name} เรียบร้อยแล้ว`,
      icon: <IconTicket />,
      onConfirm: () => {
        router.push(`/${clientConfig.slug}/coupon/my/${res.id}`);
      },
    });
  };

  return (
    <div
      className="min-h-screen relative px-4.5 pt-4.5 pb-20"
      style={{
        backgroundColor: clientConfig.ui.background_color,
        color: clientConfig.ui.text_color,
      }}
    >
      {/* Back Button */}
      <button
        onClick={() => router.push(`/${clientConfig.slug}`)}
        className="rounded-full p-2 shadow-md cursor-pointer"
        style={{
          backgroundColor: clientConfig.ui.surface_color,
        }}
      >
        <ArrowLeft size={22} color={clientConfig.ui.text_color} />
      </button>

      {/* Image */}
      <img
        src={coupon?.image_url || clientConfig.logo_url}
        alt="coupon"
        className="mt-4 h-45 w-full rounded-2xl object-cover"
        style={{
          backgroundColor: clientConfig.ui.background_white_color,
        }}
      />

      {/* Content */}
      <div className="mt-5 rounded-t-3xl">
        <div
          className="text-[32px] font-medium font-bodoni"
          style={{
            color: clientConfig.ui.text_color,
          }}
        >
          {coupon?.name}
        </div>

        <div
          className="mt-5 rounded-3xl border-[0.5px] text-[13px]"
          style={{
            backgroundColor: clientConfig.ui.surface_color,
            borderColor: `color-mix(in srgb, ${clientConfig.ui.text_gray_color} 80%, transparent)`,
          }}
        >
          <div className="p-5 mt-1 flex items-center justify-between text-lg text-[13px]">
            <p
              style={{
                color: clientConfig.ui.text_gray_color,
              }}
            >
              ใช้แต้ม
            </p>
            <p
              style={{
                color: clientConfig.ui.text_color,
              }}
            >
              {coupon?.value} {coupon?.currency.name.toUpperCase()}
            </p>
          </div>

          {coupon?.end_time && (
            <div
              className="p-5 mt-1 flex items-center justify-between text-lg border-t-[0.5px] text-[13px]"
              style={{
                borderColor: `color-mix(in srgb, ${clientConfig.ui.text_gray_color} 80%, transparent)`,
              }}
            >
              <p
                style={{
                  color: clientConfig.ui.text_gray_color,
                }}
              >
                หมดอายุ
              </p>
              <p
                style={{
                  color: clientConfig.ui.text_color,
                }}
              >
                {formatDate(coupon?.end_time)}
              </p>
            </div>
          )}
        </div>

        {/* Terms */}
        <p
          className="mt-8 text-[10px] font-semibold"
          style={{ color: clientConfig.ui.text_gray_color }}
        >
          เงื่อนไข
        </p>
        <div
          className="whitespace-pre-line min-h-56 text-[11.5px]"
          style={{
            color: clientConfig.ui.text_gray_color,
          }}
        >
          {coupon?.term_and_condition || "-"}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 z-30 w-full p-4 shadow-lg">
        {currentPoint < (coupon?.value || 0) ? (
          <Button
            text={`${coupon?.currency.name.toLocaleUpperCase()} ของคุณไม่พอ`}
            disabled
          />
        ) : (
          <Button text="แลกรับสิทธิ์" onClick={redeemCoupon} />
        )}
      </div>
    </div>
  );
}
