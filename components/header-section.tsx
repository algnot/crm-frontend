"use client";

/* eslint-disable @next/next/no-img-element */

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useApp } from "./providers/app-provider";
import { IconBell, IconCamera, IconQrcode } from "@tabler/icons-react";
import { closeScanner, openScanner } from "@/util/qr-scanner";
import { isErrorResponse } from "@/types/request";

export default function HeaderSection() {
  const { userProfile, clientConfig, backendClient } = useApp();
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptNumber, setReceiptNumber] = useState("");
  const [receiptImage, setReceiptImage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const resetReceiptForm = () => {
    setReceiptNumber("");
    setReceiptImage("");
    setCameraError("");
  };

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    try {
      setCameraError("");
      stopCamera();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      console.error(err);
      setCameraError("ไม่สามารถเปิดกล้องได้");
    }
  }, [stopCamera]);

  const handleQRCode = async (qrText: string) => {
    try {
      closeScanner();

      const isUrl = /^https?:\/\/.+/i.test(qrText);

      if (isUrl) {
        window.location.href = qrText;
        return;
      }

      alert(`QR Code:\n${qrText}`);
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาด");
    }
  };

  const onCaptureReceiptImage = async () => {
    try {
      const video = videoRef.current;
      if (!video) return;

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      if (!context) return;

      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      const base64Image = dataUrl.replace(/^data:image\/\w+;base64,/, "");

      setReceiptImage(base64Image);
    } catch (err) {
      console.error(err);
      alert("ไม่สามารถถ่ายรูปได้");
    }
  };

  useEffect(() => {
    if (!showReceiptModal) {
      stopCamera();
      return;
    }

    if (!receiptImage) {
      Promise.resolve().then(startCamera);
    }

    return () => {
      stopCamera();
    };
  }, [showReceiptModal, receiptImage, startCamera, stopCamera]);

  const onSubmitReceipt = async () => {
    if (!clientConfig.slug || !userProfile?.userId) {
      alert("ไม่พบข้อมูลผู้ใช้");
      return;
    }

    if (!receiptNumber.trim()) {
      alert("กรุณากรอกเลขใบเสร็จ");
      return;
    }

    if (!receiptImage) {
      alert("กรุณาถ่ายรูปใบเสร็จ");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await backendClient.submitReceipt(
        clientConfig.slug,
        userProfile.userId,
        receiptNumber.trim(),
        receiptImage,
      );

      if (isErrorResponse(response)) {
        alert(response.message || "ส่งใบเสร็จไม่สำเร็จ");
        return;
      }

      alert("ส่งใบเสร็จเรียบร้อย");
      setShowReceiptModal(false);
      resetReceiptForm();
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดขณะส่งใบเสร็จ");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="relative h-80 -mb-45 pointer-events-none">
        <img
          src={clientConfig?.ui?.banner ?? ""}
          alt="banner"
          className="absolute inset-0 w-full h-full object-cover block"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg,rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 30%, ${clientConfig.ui.background_color} 100%)`,
          }}
        ></div>
      </div>
      <header className="relative z-2 pt-16 px-4.5 pb-4.5 flex items-center justify-between">
        <div>
          {!!clientConfig.logo_url && (
            <img
              src={clientConfig.logo_url}
              alt="logo"
              className="h-9.5 w-auto rounded-xl bg-white"
              style={{
                boxShadow: `0 0 0 0.5px rgba(255,255,255,0.06), 0 4px 18px -4px color-mix(in oklch, ${clientConfig.ui.primary_color} 60%, transparent)`,
              }}
            />
          )}
        </div>
        <button
          className="w-9.5 h-9.5 rounded-xl flex items-center justify-center border"
          style={{
            background: clientConfig.ui.primary_color,
            borderColor: `color-mix(in srgb, ${clientConfig.ui.text_gray_color} 80%, transparent)`,
          }}
        >
          <IconBell className="text-white w-5 h-5" />
        </button>
      </header>
      <div className="relative z-2 flex items-center gap-4 px-4.5 pb-5.5">
        {!!userProfile?.pictureUrl ? (
          <img
            src={userProfile.pictureUrl}
            alt="profile"
            className="h-12.5 w-12.5 rounded-full"
            style={{
              border: `1px solid ${clientConfig.ui.primary_color}`,
            }}
          />
        ) : (
          <img
            src={clientConfig.logo_url}
            alt="profile-fallback"
            className="h-12.5 w-12.5"
          />
        )}
        <div className="flex-1 min-w-0">
          <div
            className="text-lg mb-1 font-semibold tracking-[-0.17px]"
            style={{
              color: clientConfig.ui.text_color,
            }}
          >
            {clientConfig.ui.welcome_title || "ยินดีต้อนรับ"}
          </div>

          <div
            className="text-[10px] tracking-[0.02em] truncate font-mono"
            style={{
              color: clientConfig.ui.text_gray_color,
            }}
          >
            {userProfile?.userId}
          </div>
        </div>
        {/* <button
          className="w-11 h-11 rounded-xl flex items-center justify-center border"
          style={{
            background: `linear-gradient(135deg, ${clientConfig.ui.primary_color}, ${clientConfig.ui.secondary_color})`,
            boxShadow: `0 6px 20px -4px color-mix(in oklch, ${clientConfig.ui.primary_color} 70%, transparent)`,
            borderColor: `color-mix(in srgb, ${clientConfig.ui.text_gray_color} 80%, transparent)`,
          }}
          onClick={() => {
            openScanner({
              onResult: handleQRCode,
              primaryColor: clientConfig.ui.primary_color,
              secondaryColor: clientConfig.ui.secondary_color,
              textWhiteColor: clientConfig.ui.text_white_color,
            });
          }}
        >
          <IconQrcode className="text-white w-5.5 h-5.5" />
        </button> */}
        <button
          className="w-11 h-11 rounded-xl flex items-center justify-center border"
          style={{
            background: `linear-gradient(135deg, ${clientConfig.ui.primary_color}, ${clientConfig.ui.secondary_color})`,
            boxShadow: `0 6px 20px -4px color-mix(in oklch, ${clientConfig.ui.primary_color} 70%, transparent)`,
            borderColor: `color-mix(in srgb, ${clientConfig.ui.text_gray_color} 80%, transparent)`,
          }}
          onClick={() => {
            setShowReceiptModal(true);
          }}
        >
          <IconCamera className="text-white w-5.5 h-5.5" />
        </button>
      </div>

      {showReceiptModal && (
        <div className="fixed inset-0 z-50 bg-black">
          {/* Camera Feed - Full Screen */}
          {!receiptImage && (
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                className="h-full w-full object-cover"
                autoPlay
                muted
                playsInline
              />

              {/* Camera Error */}
              {cameraError && (
                <div className="absolute top-4 left-4 right-4 text-sm text-red-400 bg-red-900/30 rounded-lg p-3">
                  {cameraError}
                </div>
              )}

              {/* Capture Button - Bottom Center */}
              <button
                type="button"
                onClick={onCaptureReceiptImage}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 rounded-full w-16 h-16 flex items-center justify-center text-white font-semibold border-4"
                style={{
                  background: clientConfig.ui.primary_color,
                  borderColor: "rgba(255,255,255,0.3)",
                }}
              >
                <IconCamera size={28} />
              </button>

              {/* Close Button - Top Right */}
              <button
                type="button"
                className="absolute top-4 right-4 rounded-full w-10 h-10 flex items-center justify-center bg-black/50 text-white border border-white/30"
                onClick={() => {
                  setShowReceiptModal(false);
                  resetReceiptForm();
                }}
              >
                ✕
              </button>
            </div>
          )}

          {/* Receipt Preview - Full Screen */}
          {receiptImage && (
            <div className="relative w-full h-full flex flex-col">
              <img
                src={`data:image/jpeg;base64,${receiptImage}`}
                alt="receipt-preview"
                className="flex-1 w-full object-contain bg-black"
              />

              {/* Preview Controls - Bottom Overlay */}
              <div
                className="p-4 space-y-3"
                style={{ background: clientConfig.ui.background_white_color }}
              >
                <label className="block text-sm font-medium">เลขใบเสร็จ</label>
                <input
                  value={receiptNumber}
                  onChange={(event) => setReceiptNumber(event.target.value)}
                  placeholder="กรอกเลขใบเสร็จ"
                  className="w-full rounded-xl border px-4 py-3"
                  style={{ borderColor: clientConfig.ui.text_gray_color }}
                />

                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    className="rounded-xl border px-4 py-3"
                    style={{ borderColor: clientConfig.ui.text_gray_color }}
                    onClick={() => setReceiptImage("")}
                    disabled={isSubmitting}
                  >
                    ถ่ายใหม่
                  </button>

                  <button
                    type="button"
                    className="rounded-xl border px-4 py-3"
                    style={{ borderColor: clientConfig.ui.text_gray_color }}
                    onClick={() => {
                      setShowReceiptModal(false);
                      resetReceiptForm();
                    }}
                    disabled={isSubmitting}
                  >
                    ยกเลิก
                  </button>

                  <button
                    type="button"
                    className="rounded-xl px-4 py-3 text-white"
                    style={{
                      background: clientConfig.ui.primary_color,
                    }}
                    onClick={onSubmitReceipt}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "ส่ง..." : "ส่ง"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
