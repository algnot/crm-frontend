"use client";

/* eslint-disable @next/next/no-img-element */

import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useApp } from "./providers/app-provider";

interface AdsItem {
  order: number;
  image: string;
  action?: string;
  title?: string;
  subtitle?: string;
  label?: string;
  date?: string;
}

export default function News() {
  const { clientConfig } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([]);

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

  const scrollToCard = useCallback((index: number) => {
    const cardElement = cardRefs.current[index];
    const scrollerElement = scrollerRef.current;

    if (!cardElement || !scrollerElement) return;

    scrollerElement.scrollTo({
      left: cardElement.offsetLeft,
      behavior: "smooth",
    });
  }, []);

  const goToPrevious = useCallback(() => {
    if (adsItems.length <= 1) return;
    const nextIndex =
      currentIndex === 0 ? adsItems.length - 1 : currentIndex - 1;
    scrollToCard(nextIndex);
  }, [adsItems.length, currentIndex, scrollToCard]);

  const goToNext = useCallback(() => {
    if (adsItems.length <= 1) return;
    const nextIndex =
      currentIndex === adsItems.length - 1 ? 0 : currentIndex + 1;
    scrollToCard(nextIndex);
  }, [adsItems.length, currentIndex, scrollToCard]);

  useEffect(() => {
    if (adsItems.length <= 1) return;

    const intervalId = window.setInterval(() => {
      const nextIndex =
        currentIndex === adsItems.length - 1 ? 0 : currentIndex + 1;
      scrollToCard(nextIndex);
    }, 4000);

    return () => window.clearInterval(intervalId);
  }, [adsItems.length, currentIndex, scrollToCard]);

  if (adsItems.length === 0) {
    return null;
  }

  const handleScroll = () => {
    const scrollerElement = scrollerRef.current;
    if (!scrollerElement) return;

    const scrollLeft = scrollerElement.scrollLeft;
    let nearestIndex = 0;
    let smallestDistance = Number.POSITIVE_INFINITY;

    cardRefs.current.forEach((cardElement, index) => {
      if (!cardElement) return;

      const distance = Math.abs(cardElement.offsetLeft - scrollLeft);

      if (distance < smallestDistance) {
        smallestDistance = distance;
        nearestIndex = index;
      }
    });

    setCurrentIndex((previousIndex) =>
      previousIndex === nearestIndex ? previousIndex : nearestIndex,
    );
  };

  return (
    <section className="mx-4.5 mb-5.5">
      <div className="mb-4 flex items-center justify-between px-0.5 text-white">
        <p
          className="text-3xl leading-none font-medium"
          style={{ color: clientConfig.ui.text_color }}
        >
          ประกาศข่าวสาร
        </p>

        <button
          type="button"
          onClick={goToNext}
          className="flex items-center gap-1 text-[18px] text-white/65"
        >
          <span>ดูทั้งหมด</span>
          <IconChevronRight size={20} />
        </button>
      </div>

      <div className="relative">
        {adsItems.length > 1 && (
          <button
            type="button"
            aria-label="Previous advertisement"
            onClick={goToPrevious}
            className="absolute left-2 top-[38%] z-10 -translate-y-1/2 rounded-full border border-white/12 bg-black/45 p-2 text-white shadow-lg backdrop-blur-sm"
          >
            <IconChevronLeft size={18} />
          </button>
        )}

        <div
          ref={scrollerRef}
          onScroll={handleScroll}
          className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-1"
        >
          {adsItems.map((adsItem, index) => {
            const isClickable = !!adsItem.action;
            const eyebrow = [adsItem.label, adsItem.date]
              .filter(Boolean)
              .join(" • ")
              .toUpperCase();

            return (
              <button
                key={`${adsItem.order}-${index}`}
                type="button"
                ref={(element) => {
                  cardRefs.current[index] = element;
                }}
                className="block w-[82%] shrink-0 snap-start overflow-hidden rounded-[28px] border border-white/8 bg-[#111111] text-left shadow-[0_18px_50px_-24px_rgba(0,0,0,0.9)] disabled:cursor-default sm:w-[78%]"
                disabled={!isClickable}
                onClick={() => {
                  if (adsItem.action) {
                    window.location.href = adsItem.action;
                  }
                }}
              >
                <img
                  src={adsItem.image}
                  alt={`ads-${index + 1}`}
                  className="h-auto w-full aspect-[1.35/1] object-cover"
                />

                <div className="space-y-2 bg-[#161616] px-5 py-4 text-white">
                  {eyebrow ? (
                    <p className="text-[14px] font-semibold tracking-[0.32em] text-fuchsia-300/90 uppercase">
                      {eyebrow}
                    </p>
                  ) : null}

                  {adsItem.title ? (
                    <p className="text-[28px] leading-[0.95] font-medium text-white">
                      {adsItem.title}
                    </p>
                  ) : null}

                  {adsItem.subtitle ? (
                    <p className="text-[18px] leading-tight text-white/70">
                      {adsItem.subtitle}
                    </p>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>

        {adsItems.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Next advertisement"
              onClick={goToNext}
              className="absolute right-2 top-[38%] z-10 -translate-y-1/2 rounded-full border border-white/12 bg-black/45 p-2 text-white shadow-lg backdrop-blur-sm"
            >
              <IconChevronRight size={18} />
            </button>

            <div className="mt-4 flex items-center justify-center gap-2">
              {adsItems.map((adsItem, index) => (
                <button
                  key={`indicator-${adsItem.order}-${index}`}
                  type="button"
                  aria-label={`Go to advertisement ${index + 1}`}
                  onClick={() => scrollToCard(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    currentIndex === index
                      ? "w-7 bg-white"
                      : "w-2.5 bg-white/25"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
