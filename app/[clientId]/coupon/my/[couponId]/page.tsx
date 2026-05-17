"use client";

import Button from "@/components/button";
import { useApp } from "@/components/providers/app-provider";
import { isErrorResponse, UserCoupon } from "@/types/request";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft } from "tabler-icons-react";
import QRCode from "react-qr-code";
import Barcode from "react-barcode";

function parseUtcExpiration(dateStr: string): Date {
  return new Date(dateStr.replace(" ", "T") + "Z");
}

function formatCountdown(totalSeconds: number): string {
  const seconds = Math.max(0, totalSeconds);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return [hours, minutes, secs]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}

function getRemainingSeconds(expirationDate: string): number {
  const expiration = parseUtcExpiration(expirationDate);
  return Math.floor((expiration.getTime() - Date.now()) / 1000);
}

export default function Page() {
  const params = useParams();
  const router = useRouter();

  const { backendClient, clientConfig, userProfile, setIsShowNavbar } =
    useApp();

  const couponId = Array.isArray(params.couponId)
    ? params.couponId[0]
    : params.couponId;

  const [coupon, setCoupon] = useState<UserCoupon>();
  const [codeType, setCodeType] = useState<"qr" | "bar">("qr");
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);

  useEffect(() => {
    setIsShowNavbar(false);

    fetchData();

    return () => {
      setIsShowNavbar(true);
    };
  }, [userProfile, couponId]);

  useEffect(() => {
    if (!coupon?.expiration_date || coupon.is_used) {
      setRemainingSeconds(null);
      return;
    }

    const updateRemaining = () => {
      setRemainingSeconds(getRemainingSeconds(coupon.expiration_date));
    };

    updateRemaining();
    const interval = setInterval(updateRemaining, 1000);

    return () => clearInterval(interval);
  }, [coupon?.expiration_date, coupon?.is_used]);

  const fetchData = async () => {
    if (!userProfile || !couponId) {
      return;
    }

    const coupon = await backendClient.getUserCouponById(
      clientConfig.slug,
      userProfile.userId,
      couponId,
    );

    if (isErrorResponse(coupon)) {
      window.location.href = `/${clientConfig.slug}`;
      return;
    }

    setCoupon(coupon);
  };

  const onUseCoupon = async () => {
    if (!userProfile || !couponId || !coupon) {
      return;
    }

    const response = await backendClient.onUseCoupon(
      clientConfig.slug,
      userProfile.userId,
      coupon.code,
    );

    if (isErrorResponse(response)) {
      window.location.href = `/${clientConfig.slug}`;
      return;
    }

    alert("ใช้คูปองแล้ว");

    fetchData();
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: clientConfig.ui.background_color,
        color: clientConfig.ui.text_color,
      }}
    >
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="fixed top-5 left-5 z-50 rounded-full p-2 shadow-md"
        style={{
          backgroundColor: clientConfig.ui.background_white_color,
        }}
      >
        <ArrowLeft size={22} color={clientConfig.ui.text_color} />
      </button>

      {/* Image */}
      <img
        src={coupon?.coupon.image_url || clientConfig.logo_url}
        alt="coupon"
        className="w-full aspect-square object-cover"
        style={{
          backgroundColor: clientConfig.ui.background_white_color,
        }}
      />

      {/* Content */}
      <div
        className="-mt-8 relative z-10 rounded-t-3xl p-5 pb-28 shadow-md"
        style={{
          backgroundColor: clientConfig.ui.background_white_color,
        }}
      >
        <div
          className="text-2xl font-bold"
          style={{
            color: clientConfig.ui.primary_color,
          }}
        >
          {coupon?.name}
        </div>

        <div
          className="mt-1"
          style={{
            color: clientConfig.ui.text_gray_color,
          }}
        >
          ใช้ได้ถึง {coupon?.expiration_date}
        </div>

        {coupon?.is_used && (
          <div
            className="mt-1"
            style={{
              color: clientConfig.ui.text_gray_color,
            }}
          >
            ใช้เมื่อ {coupon.used_date}
          </div>
        )}

        {/* QR / Barcode */}
        {coupon?.code && !coupon.is_used && (
          <div className="mt-8 flex flex-col items-center">
            {remainingSeconds !== null && (
              <div className="mb-5 text-center">
                <div
                  className="text-lg"
                  style={{ color: clientConfig.ui.text_gray_color }}
                >
                  เหลือเวลาใช้งาน
                </div>
                <div
                  className="mt-1 text-2xl font-mono font-bold tracking-wider"
                  style={{
                    color:
                      remainingSeconds > 0
                        ? clientConfig.ui.primary_color
                        : clientConfig.ui.text_error_color,
                  }}
                >
                  {formatCountdown(remainingSeconds)}
                </div>
              </div>
            )}

            {/* Toggle */}
            <div
              className="flex rounded-full overflow-hidden my-5"
              style={{
                backgroundColor: clientConfig.ui.background_color,
              }}
            >
              <button
                onClick={() => setCodeType("qr")}
                className="px-5 py-2 cursor-pointer text-xl"
                style={{
                  backgroundColor:
                    codeType === "qr"
                      ? clientConfig.ui.primary_color
                      : clientConfig.ui.background_color,

                  color:
                    codeType === "qr" ? "#fff" : clientConfig.ui.text_color,
                }}
              >
                QR Code
              </button>

              <button
                onClick={() => setCodeType("bar")}
                className="px-5 py-2 cursor-pointer text-xl"
                style={{
                  backgroundColor:
                    codeType === "bar"
                      ? clientConfig.ui.primary_color
                      : clientConfig.ui.background_color,

                  color:
                    codeType === "bar" ? "#fff" : clientConfig.ui.text_color,
                }}
              >
                Barcode
              </button>
            </div>

            {/* Code */}
            <div
              className="p-5 flex justify-center items-center min-h-[250px] w-full"
              style={{
                backgroundColor: clientConfig.ui.background_white_color,
              }}
            >
              {codeType === "qr" ? (
                <QRCode value={coupon.code} size={240} />
              ) : (
                <Barcode
                  value={coupon.code}
                  format="CODE128"
                  width={2}
                  height={100}
                  displayValue={false}
                />
              )}
            </div>

            {/* Raw code */}
            <div
              className="mt-4 font-mono break-all text-center p-3 rounded-sm"
              style={{
                color: clientConfig.ui.text_color,
                backgroundColor: clientConfig.ui.background_color,
              }}
            >
              {coupon.code}
            </div>
          </div>
        )}

        {/* Terms */}
        <div
          className="mt-8 whitespace-pre-line leading-8 min-h-56"
          style={{
            color: clientConfig.ui.text_color,
          }}
        >
          {coupon?.coupon.term_and_condition || "-"}
        </div>
      </div>

      {/* Bottom Button */}
      <div
        className="fixed bottom-0 left-0 z-30 w-full p-4 shadow-lg"
        style={{
          backgroundColor: clientConfig.ui.background_white_color,
        }}
      >
        {coupon?.is_used ? (
          <div
            className="text-center text-xl rounded-md p-3"
            style={{
              color: clientConfig.ui.background_white_color,

              backgroundColor: clientConfig.ui.secondary_color,
            }}
          >
            คุณใช้คูปองนี้เรียบร้อยแล้ว
          </div>
        ) : (
          <Button text="ใช้คูปอง" onClick={onUseCoupon} />
        )}
      </div>
    </div>
  );
}
