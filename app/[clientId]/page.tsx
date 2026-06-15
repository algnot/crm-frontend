"use client";

import PointCard from "@/components/point-card";
import CouponSection from "@/components/coupon-section";
import NewsSection from "@/components/news-section";
import HeaderSection from "@/components/header-section";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useApp } from "@/components/providers/app-provider";
import { IconX } from "@tabler/icons-react";
import TierCard from "@/components/tier-card";
import Button from "@/components/button";
import { formatDate } from "@/util/format-date";

export default function Home() {
  const { clientConfig } = useApp();

  const [showModal, setShowModal] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const modalShownKey = useMemo(
    () => `news-modal-shown:${clientConfig.slug || "default"}`,
    [clientConfig.slug],
  );

  const adsItems = clientConfig.ads;

  useEffect(() => {
    if (adsItems.length === 0) return;
    if (!clientConfig.slug) return;

    const hasShown = sessionStorage.getItem(modalShownKey) === "1";
    if (hasShown) return;

    sessionStorage.setItem(modalShownKey, "1");

    Promise.resolve().then(() => {
      setModalIndex(0);
      setShowModal(true);
    });
  }, [adsItems.length, clientConfig.slug, modalShownKey]);

  const closeModal = () => setShowModal(false);

  const goModalNext = useCallback(() => {
    if (adsItems.length <= 1) return;
    setModalIndex((i) => (i === adsItems.length - 1 ? 0 : i + 1));
  }, [adsItems.length]);

  const goModalPrev = useCallback(() => {
    if (adsItems.length <= 1) return;
    setModalIndex((i) => (i === 0 ? adsItems.length - 1 : i - 1));
  }, [adsItems.length]);

  useEffect(() => {
    if (!showModal) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowRight") goModalNext();
      if (e.key === "ArrowLeft") goModalPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [showModal, goModalNext, goModalPrev]);

  return (
    <div className="h-dvh pb-20">
      <HeaderSection />
      <PointCard />
      <TierCard />
      <NewsSection />
      <CouponSection />

      <div className="p-15"></div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-8">
          <div
            className="relative w-full max-w-lg rounded-2xl text-white shadow-2xl"
            style={{
              background: clientConfig.ui.surface_color,
            }}
          >
            <button
              type="button"
              onClick={closeModal}
              className="absolute top-3 right-3 z-20 grid h-9 w-9 place-items-center rounded-full text-white"
              aria-label="Close"
              style={{
                background: clientConfig.ui.surface_color,
              }}
            >
              <IconX size={18} />
            </button>

            <div className="overflow-hidden rounded-t-2xl">
              <img
                src={adsItems[modalIndex].image_url}
                alt={`ads-modal-${modalIndex + 1}`}
                className="w-full h-[180px] object-cover"
              />
            </div>

            <div className="p-6">
              <div
                className="mb-2 text-[10px] font-semibold font-mono text-end"
                style={{
                  color: clientConfig.ui.text_gray_color,
                }}
              >
                {[
                  formatDate(adsItems[modalIndex].start_date),
                  formatDate(adsItems[modalIndex].end_date),
                ].join(" • ")}
              </div>

              <h3 className="mb-3 text-2xl font-medium font-bodoni">
                {adsItems[modalIndex].title}
              </h3>

              {adsItems[modalIndex].message && (
                <p
                  className="mb-5 text-[12.5px] leading-5 text-pretty"
                  style={{
                    color: clientConfig.ui.text_gray_color,
                  }}
                >
                  {adsItems[modalIndex].message}
                </p>
              )}
              <div className="mt-3.5 mb-1 w-full flex justify-center items-center gap-2">
                {adsItems.map((_, i) => (
                  <button
                    key={`modal-ind-${i}`}
                    type="button"
                    onClick={() => setModalIndex(i)}
                    className={`h-2.5 rounded-full ${modalIndex === i ? "w-7" : "w-2.5"}`}
                    style={{
                      backgroundColor:
                        modalIndex === i
                          ? clientConfig.ui.primary_color
                          : clientConfig.ui.text_gray_color,
                    }}
                  />
                ))}
              </div>
              <div className="mt-5 flex items-center gap-3">
                <Button
                  text="ข้าม"
                  size="sm"
                  onClick={closeModal}
                  className="bg-white/10!"
                />

                {adsItems[modalIndex].action && (
                  <Button
                    text="อ่านเงื่อนไข"
                    size="sm"
                    className="w-5/2!"
                    onClick={() => {
                      const action = adsItems[modalIndex].action;
                      if (action) window.location.href = action;
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
