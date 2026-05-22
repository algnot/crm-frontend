import { GetUserPointRespont, isErrorResponse } from "@/types/request";
import React, { useEffect, useRef, useState } from "react";
import { useApp } from "./providers/app-provider";
import { IconScan, IconX } from "@tabler/icons-react";
import { Html5Qrcode } from "html5-qrcode/esm/html5-qrcode";
import { createPortal } from "react-dom";

export default function PointCard() {
  const { userProfile, clientConfig, backendClient, setUserPoint } = useApp();
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

  const releaseScanner = async () => {
    try {
      if (qrRef.current?.isScanning) {
        await qrRef.current.stop();
        qrRef.current.clear();
      }
    } catch {}

    qrRef.current = null;
  };

  useEffect(() => {
    if (!showScanner) return;

    let cancelled = false;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const startScanner = async () => {
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      });
      if (cancelled) return;

      const scanner = new Html5Qrcode("qr-reader");
      qrRef.current = scanner;

      try {
        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: (viewfinderWidth, viewfinderHeight) => {
              const size = Math.floor(
                Math.min(viewfinderWidth, viewfinderHeight) * 0.7,
              );

              return { width: size, height: size };
            },
          },
          (decodedText) => {
            if (!cancelled) handleQRCode(decodedText);
          },
          () => {},
        );
      } catch (err) {
        console.error(err);
      }
    };

    startScanner();

    return () => {
      cancelled = true;
      document.body.style.overflow = previousOverflow;
      releaseScanner();
    };
  }, [showScanner]);

  const stopScanner = async () => {
    await releaseScanner();
    setShowScanner(false);
  };

  const fetchData = async () => {
    if (!clientConfig.slug || !userProfile?.userId) return;

    const points = await backendClient.getUserPoint(
      clientConfig.slug,
      userProfile.userId,
    );

    if (isErrorResponse(points)) {
      setUserPoint([]);
      return;
    }
    setUserPoint(points);

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
    <section
      className="relative mx-4.5 mb-5.5 rounded-[22px] pt-5.5 px-5.5 pb-5 overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${clientConfig.ui.primary_color}, ${clientConfig.ui.secondary_color})`,
        boxShadow: `10px 10px 40px -10px color-mix(in oklch, ${clientConfig.ui.secondary_color} 60%, transparent), inset 0 1px 0 rgba(255,255,255,0.18)`,
      }}
    >
      <div
        className="absolute w-[70%] h-[140%] top-[-40%] right-[-20%] blur-lg"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.25), transparent 60%)",
        }}
      ></div>
      <p
        style={{ color: clientConfig.ui.text_white_color }}
        className="text-xs font-medium"
      >
        พ้อยคงเหลือ
      </p>
      <p className="text-white mt-1">
        <span className="text-5xl font-semibold">
          {mainPoint.balance.toLocaleString()}{" "}
        </span>
        <span>PTS</span>
      </p>
      <div className="pt-3 flex justify-between border-t border-white text-white">
        <p>Lifetime · xxxx</p>
        <div
          className="cursor-pointer flex items-center gap-2.5 border rounded-full px-3 py-1 bg-[rgba(255,255,255,0.18)] z-1"
          onClick={() => setShowScanner(true)}
        >
          <IconScan size={16} /> เก็บแต้ม
        </div>
      </div>

      {showScanner &&
        createPortal(
          <div className="qr-scanner-overlay fixed inset-0 z-100 h-dvh w-full bg-black overflow-hidden">
            <button
              onClick={stopScanner}
              className="absolute top-4 right-4 z-20 rounded-full p-2 cursor-pointer"
              style={{
                background: clientConfig.ui.primary_color,
                color: clientConfig.ui.text_white_color,
              }}
            >
              <IconX />
            </button>

            <div
              id="qr-reader"
              className="absolute inset-0 w-full h-full min-h-0"
            />

            <div className="absolute bottom-8 inset-x-0 z-20 flex justify-center px-4">
              <div
                className="text-2xl text-center px-5 py-2 rounded-md"
                style={{
                  background: clientConfig.ui.secondary_color,
                  color: clientConfig.ui.text_white_color,
                }}
              >
                สแกน QR Code ท้ายใบเสร็จเพื่อสะสม {mainPoint.currency.name}{" "}
                <br />
                กรุณาวาง QR Code ให้อยู่ในกรอบ
              </div>
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
}
