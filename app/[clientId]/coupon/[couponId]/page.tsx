"use client";

/* eslint-disable react-hooks/set-state-in-effect */

/* eslint-disable @next/next/no-img-element */

import { useApp } from "@/components/providers/app-provider";
import { CouponType, isErrorResponse } from "@/types/request";
import { ArrowLeft } from "tabler-icons-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import Button from "@/components/button";

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
      alert(res.message);
      window.location.href = `/${clientConfig.slug}`;
      return;
    }

    alert("redeem coupon done :)");
    window.location.href = `/${clientConfig.slug}/coupon/my/${res.id}`;
  };

  return (
    <div
      className="min-h-screen relative p-4.5"
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
          className="text-2xl font-bold"
          style={{
            color: clientConfig.ui.text_color,
          }}
        >
          {coupon?.name}
        </div>

        {(coupon?.value || 0) > 0 ? (
          <div
            className="mt-3 text-xl font-medium"
            style={{
              color: clientConfig.ui.text_color,
            }}
          >
            ใช้ {coupon?.value?.toLocaleString()} {coupon?.currency.name}{" "}
            <span style={{ color: clientConfig.ui.text_gray_color }}>
              (มีอยู่ {currentPoint.toLocaleString()} {coupon?.currency.name})
            </span>
          </div>
        ) : (
          <div
            className="mt-3 text-xl font-medium"
            style={{
              color: clientConfig.ui.text_color,
            }}
          >
            แลกได้ฟรี
          </div>
        )}

        <div
          className="mt-1"
          style={{
            color: clientConfig.ui.text_gray_color,
          }}
        >
          แลกได้ถึง {coupon?.end_time}
        </div>

        <div
          className="mt-6 whitespace-pre-line leading-8 min-h-56"
          style={{
            color: clientConfig.ui.text_color,
          }}
        >
          {coupon?.term_and_condition || "-"}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 z-30 w-full p-4 shadow-lg">
        {currentPoint < (coupon?.value || 0) ? (
          <div
            className="text-center text-xl rounded-md p-2"
            style={{
              color: clientConfig.ui.background_white_color,
              backgroundColor: clientConfig.ui.secondary_color,
            }}
          >
            {coupon?.currency.name.toLocaleUpperCase()} ของคุณไม่พอ
          </div>
        ) : (
          <Button text="แลกคูปอง" onClick={redeemCoupon} />
        )}
      </div>
    </div>
  );
}
