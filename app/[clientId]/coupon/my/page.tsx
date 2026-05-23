"use client";
import ChipButton from "@/components/ChipButton";
import { useApp } from "@/components/providers/app-provider";
import { isErrorResponse, UserCoupon } from "@/types/request";
import { useEffect, useState } from "react";
import { Ticket } from "tabler-icons-react";

export default function page() {
  const { clientConfig, backendClient, userProfile } = useApp();
  const [userCoupons, setUserCoupons] = useState<UserCoupon[]>([]);
  const [selectedTab, setSelectedTab] = useState<
    "available" | "used" | "expired"
  >("available");

  useEffect(() => {
    fetchData();
  }, [userProfile]);

  const fetchData = async () => {
    if (!userProfile) {
      return;
    }
    const response = await backendClient.getUserCoupon(
      clientConfig.slug,
      userProfile?.userId,
    );
    if (isErrorResponse(response)) {
      window.location.href = `/${clientConfig.slug}`;
      return;
    }
    setUserCoupons(response);
  };

  const canUseCoupon = userCoupons.filter((item) => {
    const expiration = new Date(item.expiration_date.replace(" ", "T") + "Z");

    return !item.is_used && expiration > new Date();
  });

  const usedCoupon = userCoupons.filter((item) => item.is_used);

  const expiredCoupon = userCoupons.filter((item) => {
    const expiration = new Date(item.expiration_date.replace(" ", "T") + "Z");

    return !item.is_used && expiration < new Date();
  });

  const displayCoupons =
    selectedTab === "available"
      ? canUseCoupon
      : selectedTab === "used"
        ? usedCoupon
        : expiredCoupon;

  return (
    <div className="px-5 pt-4">
      {/* <Profile /> */}

      <div
        className="text-3xl leading-none font-medium mt-5 mb-2"
        style={{ color: clientConfig.ui.text_color }}
      >
        คูปองของฉัน
      </div>

      <div className="flex gap-2">
        <ChipButton
          label={`ใช้ได้ (${canUseCoupon.length})`}
          selected={selectedTab === "available"}
          onSelect={() => setSelectedTab("available")}
        />
        <ChipButton
          label={`ใช้แล้ว (${usedCoupon.length})`}
          selected={selectedTab === "used"}
          onSelect={() => setSelectedTab("used")}
        />
        <ChipButton
          label={`หมดอายุ (${expiredCoupon.length})`}
          selected={selectedTab === "expired"}
          onSelect={() => setSelectedTab("expired")}
        />
      </div>

      {displayCoupons.length === 0 && (
        <div className="py-16 flex flex-col items-center text-center gap-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: `${clientConfig.ui.text_gray_color}`,
              opacity: 0.7,
            }}
          >
            <Ticket size={30} color={clientConfig.ui.text_white_color} />
          </div>

          <div>
            <div
              className="text-lg font-semibold"
              style={{ color: clientConfig.ui.text_color }}
            >
              ยังไม่มีคูปอง
            </div>

            <div
              className="text-sm text-gray-500 mt-1"
              style={{ color: clientConfig.ui.text_gray_color }}
            >
              เมื่อคุณได้รับคูปอง รายการจะแสดงที่นี่
            </div>
          </div>
        </div>
      )}

      <div className="mt-5 flex flex-col gap-3">
        {displayCoupons.map((coupon, index) => {
          const expiration = new Date(
            coupon.expiration_date.replace(" ", "T") + "Z",
          );

          const canUse = !coupon.is_used && expiration > new Date();

          return (
            <div
              key={index}
              className="flex gap-4 rounded-md overflow-hidden cursor-pointer shadow-md"
              onClick={() => {
                window.location.href = `/${clientConfig.slug}/coupon/my/${coupon.id}`;
              }}
              style={{
                backgroundColor: clientConfig.ui.background_white_color,
                color: clientConfig.ui.text_color,
                opacity: canUse ? 1 : 0.7,
              }}
            >
              <img
                src={coupon.coupon.image_url || clientConfig.logo_url}
                alt=""
                className="w-30 h-30 object-contain"
              />

              <div className="py-2 flex flex-col flex-1">
                <div
                  className="text-2xl line-clamp-1"
                  style={{
                    color: clientConfig.ui.primary_color,
                  }}
                >
                  {coupon.name}
                </div>

                <div
                  style={{
                    color: clientConfig.ui.text_gray_color,
                  }}
                >
                  ใช้ {coupon.value.toLocaleString()} {coupon.currency.name}
                </div>

                <div className="mt-auto">หมดอายุ {coupon.expiration_date}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
