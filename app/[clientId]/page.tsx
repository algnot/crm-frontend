"use client";

import PointCard from "@/components/point-card";
import TeirCard from "@/components/teir-card";
import CouponSection from "@/components/coupon-section";
import NewsSection, { AdsItem } from "@/components/news-section";
import HeaderSection from "@/components/header-section";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useApp } from "@/components/providers/app-provider";
import { IconX } from "@tabler/icons-react";

export default function Home() {
  const { clientConfig } = useApp();

  const [showModal, setShowModal] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const modalShownKey = useMemo(
    () => `news-modal-shown:${clientConfig.slug || "default"}`,
    [clientConfig.slug],
  );

  const adsItems = useMemo<AdsItem[]>(() => {
    const groupedAds = new Map<string, Partial<AdsItem> & { order: number }>();

    clientConfig.ui.ui_custom_fields.forEach((customField) => {
      const imageMatch = customField.key.match(/^ads(?:_(\d+))?$/);
      const actionMatch = customField.key.match(/^ads_action(?:_(\d+))?$/);
      const titleMatch = customField.key.match(/^ads_title(?:_(\d+))?$/);
      const subtitleMatch = customField.key.match(/^ads_subtitle(?:_(\d+))?$/);
      const labelMatch = customField.key.match(/^ads_label(?:_(\d+))?$/);
      const dateMatch = customField.key.match(/^ads_date(?:_(\d+))?$/);

      if (
        !imageMatch &&
        !actionMatch &&
        !titleMatch &&
        !subtitleMatch &&
        !labelMatch &&
        !dateMatch
      ) {
        return;
      }

      const rawOrder =
        imageMatch?.[1] ??
        actionMatch?.[1] ??
        titleMatch?.[1] ??
        subtitleMatch?.[1] ??
        labelMatch?.[1] ??
        dateMatch?.[1] ??
        "0";
      const groupKey = rawOrder;
      const order = Number(rawOrder);
      const existingItem = groupedAds.get(groupKey) ?? { order };

      if (imageMatch) {
        existingItem.image = customField.value;
      }

      if (actionMatch) {
        existingItem.action = customField.value;
      }

      if (titleMatch) {
        existingItem.title = customField.value;
      }

      if (subtitleMatch) {
        existingItem.subtitle = customField.value;
      }

      if (labelMatch) {
        existingItem.label = customField.value;
      }

      if (dateMatch) {
        existingItem.date = customField.value;
      }

      groupedAds.set(groupKey, existingItem);
    });

    return [...groupedAds.values()]
      .filter((item): item is AdsItem => typeof item.image === "string")
      .sort((left, right) => left.order - right.order)
      .map((item) => ({
        ...item,
        subtitle:
          item.subtitle || (item.action ? "แตะเพื่อดูรายละเอียด" : undefined),
      }));
  }, [clientConfig.ui.ui_custom_fields]);

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
      <TeirCard />
      <NewsSection />
      <CouponSection />

      <div className="p-15"></div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-8">
          <div
            className="relative w-full max-w-lg rounded-2xl text-white shadow-2xl border-[0.5px] border-[rgba(255,255,255,0.08)]"
            style={{
              background: clientConfig.ui.ui_custom_fields.find(
                (field) => field.key === "surface_color",
              )?.value,
            }}
          >
            <button
              type="button"
              onClick={closeModal}
              className="absolute top-3 right-3 z-20 grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white"
              aria-label="Close"
            >
              <IconX size={18} />
            </button>

            <div className="overflow-hidden rounded-t-2xl">
              <img
                src={adsItems[modalIndex].image}
                alt={`ads-modal-${modalIndex + 1}`}
                className="w-full object-cover"
                style={{ height: 340 }}
              />
            </div>

            <div className="p-6">
              <div className="mb-2 text-sm font-semibold text-fuchsia-300">
                {[adsItems[modalIndex].label, adsItems[modalIndex].date]
                  .filter(Boolean)
                  .join(" • ")
                  .toUpperCase()}
              </div>

              <h3 className="mb-3 text-2xl font-medium">
                {adsItems[modalIndex].title}
              </h3>

              {adsItems[modalIndex].subtitle && (
                <p className="mb-5 text-white/80">
                  {adsItems[modalIndex].subtitle}
                </p>
              )}
              <div className="mt-3.5 mb-1 w-full flex justify-center items-center gap-2">
                {adsItems.map((_, i) => (
                  <button
                    key={`modal-ind-${i}`}
                    type="button"
                    onClick={() => setModalIndex(i)}
                    className={`h-2.5 rounded-full ${modalIndex === i ? "w-7 bg-fuchsia-400" : "w-2.5 bg-white/25"}`}
                  />
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl bg-white/10 px-4 py-3 text-sm"
                >
                  ข้าม
                </button>

                <div className="flex items-center gap-3"></div>
                <button
                  type="button"
                  onClick={() => {
                    const action = adsItems[modalIndex].action;
                    if (action) window.location.href = action;
                    else goModalNext();
                  }}
                  className="w-full rounded-xl px-6 py-3 font-semibold"
                  style={{
                    background: clientConfig.ui.primary_color,
                    color: clientConfig.ui.text_color,
                  }}
                >
                  อ่านเงื่อนไข →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
