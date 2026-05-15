"use client";
import Button from "@/components/button";
import Card from "@/components/card";
import { useApp } from "@/components/providers/app-provider";
import { GetUserPointRespont, isErrorResponse } from "@/types/request";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Award, Camera, User, X } from "tabler-icons-react";
import { Html5Qrcode } from "html5-qrcode";
import { useRouter, useSearchParams } from "next/navigation";

export default function Home() {
  const { userProfile, clientConfig, backendClient } = useApp();

  const router = useRouter();
  const searchParams = useSearchParams();

  const [showScanner, setShowScanner] = useState(false);
  const qrRef = useRef<Html5Qrcode | null>(null);

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

  // redirect จาก query param
  useEffect(() => {
    const redeemCode = searchParams.get("redeem_code");
    const partner = searchParams.get("partner");

    if (redeemCode && partner) {
      router.replace(`/${partner}/redeem/${redeemCode}`);
      return;
    }
  }, [searchParams, router]);

  useEffect(() => {
    fetchData();
  }, [clientConfig.slug, userProfile?.userId]);

  useEffect(() => {
    if (!showScanner) return;

    const scanner = new Html5Qrcode("qr-reader");
    qrRef.current = scanner;

    scanner
      .start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: {
            width: 220,
            height: 220,
          },
        },
        (decodedText) => {
          handleQRCode(decodedText);
        },
        () => {},
      )
      .catch(console.error);

    return () => {
      stopScanner();
    };
  }, [showScanner]);

  const stopScanner = async () => {
    try {
      if (qrRef.current?.isScanning) {
        await qrRef.current.stop();
        await qrRef.current.clear();
      }
    } catch {}

    setShowScanner(false);
  };

  const fetchData = async () => {
    if (!clientConfig.slug || !userProfile?.userId) return;

    const points = await backendClient.getUserPoint(
      clientConfig.slug,
      userProfile.userId,
    );

    if (isErrorResponse(points)) {
      window.location.href = `/${clientConfig.slug}`;
      return;
    }

    const mainPoint = points.find((point) => point.currency.is_default);

    if (mainPoint) setMainPoint(mainPoint);
  };

  const handleQRCode = async (qrText: string) => {
    try {
      console.log("QR:", qrText);
      await stopScanner();

      const isUrl = /^https?:\/\/.+/i.test(qrText);

      if (isUrl) {
        window.location.href = qrText;
        return;
      }

      alert(`QR Code:\n${qrText}`);
      await fetchData();
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาด");
    }
  };

  return (
    <div className="h-dvh flex flex-col overflow-hidden">
      <div className="p-5 shrink-0">
        {/* HEADER */}
        <div className="flex justify-between items-center bg-white p-2 px-5 rounded-md shadow-md">
          <Link href={`/${clientConfig.slug}/member`} className="flex gap-4">
            {!!userProfile?.pictureUrl ? (
              <img
                src={userProfile.pictureUrl}
                className="h-13 w-13 rounded-full border-2"
              />
            ) : (
              <img src={clientConfig.logo_url} className="h-10 w-10" />
            )}

            <div>
              <div
                className="text-[18px]"
                style={{
                  color: clientConfig.ui.primary_color,
                }}
              >
                {clientConfig.ui.welcome_title || "ยินดีต้อนรับ"}
              </div>

              <div className="text-2xl">{userProfile?.displayName}</div>
            </div>
          </Link>

          {!!clientConfig.logo_url && (
            <img src={clientConfig.logo_url} className="h-20 w-20" />
          )}
        </div>

        {/* CARD */}
        <div className="flex mt-4 gap-3">
          <Card
            title={
              <>
                <Award /> {mainPoint.currency.name}
              </>
            }
            value={
              <div className="text-xl">
                {mainPoint.balance.toLocaleString()}
              </div>
            }
            style={{
              backgroundColor: clientConfig.ui.primary_color,
              color: clientConfig.ui.button_text_color,
            }}
          />

          <Card
            title={
              <>
                <User /> ระดับสมาชิก
              </>
            }
            value={<div>new member</div>}
            style={{
              backgroundColor: clientConfig.ui.secondary_color,
              color: clientConfig.ui.button_text_color,
            }}
            className=""
          />
        </div>

        <div className="bg-white mt-4 shadow-md rounded-md p-5">
          <div className="text-center text-2xl">
            สะสมคะแนนผ่านการสแกน QR Code
          </div>

          {/* SCANNER */}
          {showScanner && (
            <div className="mt-4 bg-black rounded-xl overflow-hidden relative">
              <button
                onClick={stopScanner}
                className="absolute top-4 right-4 z-20 bg-white rounded-full p-2"
              >
                <X />
              </button>

              <div className="relative h-[320px]">
                <div id="qr-reader" className="h-full" />
              </div>
            </div>
          )}

          {!showScanner && (
            <Button
              icon={<Camera />}
              className="mt-4"
              text="สแกน QR Code"
              onClick={() => setShowScanner(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
