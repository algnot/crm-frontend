"use client";
import { useEffect, useRef, useState } from "react";
import { useApp } from "./providers/app-provider";
import Link from "next/link";
import { Award, Scan, X } from "tabler-icons-react";
import { Html5Qrcode } from "html5-qrcode";
import { GetUserPointRespont, isErrorResponse } from "@/types/request";

export default function Profile() {
  const { userProfile, clientConfig, backendClient } = useApp();
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
          qrbox: (viewfinderWidth, viewfinderHeight) => {
            const size = Math.min(viewfinderWidth, viewfinderHeight) * 0.65;

            return {
              width: size,
              height: size,
            };
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
        qrRef.current.clear();
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
    <div className="shrink-0">
      {/* HEADER */}
      <div className="flex justify-between items-center bg-white p-2 px-5 rounded-t-md shadow-md">
        <Link href={`/${clientConfig.slug}/member`} className="flex gap-4">
          {!!userProfile?.pictureUrl ? (
            <img
              src={userProfile.pictureUrl}
              className="h-14 w-14 rounded-full border-2"
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
      <div
        className="flex shadow-md rounded-b-md px-5 py-4 gap-3 items-center justify-between"
        style={{
          backgroundColor: clientConfig.ui.primary_color,
          color: clientConfig.ui.text_white_color,
        }}
      >
        <div className="flex items-center gap-2">
          <Award />
          <span>
            <span className="text-2xl">
              {mainPoint.balance.toLocaleString()}{" "}
            </span>
            <span className="text-xl">
              {mainPoint.currency.name.toLocaleUpperCase()}
            </span>
          </span>
        </div>
        <div className="cursor-pointer" onClick={() => setShowScanner(true)}>
          <Scan />
        </div>
      </div>

      {showScanner && (
        <div className="fixed z-100 top-0 right-0 min-w-screen min-h-screen max-w-screen max-h-screen bg-black overflow-hidden">
          <button
            onClick={stopScanner}
            className="absolute top-4 right-4 z-20 rounded-full p-2 cursor-pointer"
            style={{
              background: clientConfig.ui.primary_color,
              color: clientConfig.ui.text_white_color,
            }}
          >
            <X />
          </button>

          <div className="fixed inset-0 w-screen h-screen">
            <div id="qr-reader" className="w-full h-full" />
          </div>
          <div className="fixed bottom-8 w-screen flex justify-center">
            <div
              className="text-2xl text-center px-5"
              style={{
                background: clientConfig.ui.secondary_color,
                color: clientConfig.ui.text_white_color,
              }}
            >
              สแกน QR Code ท้ายใบเสร็จเพื่อสะสม {mainPoint.currency.name} <br />
              กรุณาวาง QR Code ให้อยู่ในกรอบ
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
