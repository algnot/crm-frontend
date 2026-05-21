"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Ticket } from "tabler-icons-react";
import { useApp } from "./providers/app-provider";
import {
  IconClock,
  IconScan,
  IconSettings,
  IconShoppingBag,
} from "@tabler/icons-react";

const navbars = [
  {
    icon: IconShoppingBag,
    href: "/",
    title: "หน้าหลัก",
  },
  {
    icon: Ticket,
    href: "/coupon/my",
    title: "คูปอง",
  },
  {
    icon: IconScan,
    href: "/scan",
    title: "สแกน QR",
    isCenter: true,
  },
  {
    icon: IconClock,
    href: "/coupon",
    title: "ประวัติ",
  },
  {
    icon: IconSettings,
    href: "/member",
    title: "ตั้งค่า",
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const { clientConfig, appUserProfile, isShowNavbar } = useApp();

  const getHref = (href: string) =>
    href === "/" ? `/${clientConfig.slug}` : `/${clientConfig.slug}${href}`;

  if (
    typeof appUserProfile === "undefined" ||
    appUserProfile?.force_verify_phone ||
    appUserProfile?.force_verify_email
  ) {
    return;
  }

  if (!isShowNavbar) {
    return;
  }

  return (
    <>
      <div style={{ height: 110 }}></div>
      <div
        className="navbar grid grid-cols-[1fr_1fr_72px_1fr_1fr] justify-around items-center pt-2 px-3.5 pb-7.5 shadow-md bg-[linear-gradient(180deg,transparent,var(--bg)_30%)]"
        style={{
          background: "linear-gradient(180deg, transparent, #0a0a0a 30%)",
        }}
      >
        {navbars.map((navbar, index) => {
          const targetPath = getHref(navbar.href);
          const isActive = pathname === targetPath;
          const Icon = navbar.icon;

          if (navbar.isCenter) {
            return (
              <div key={index} className="flex justify-center items-center">
                <div
                  className="w-15 h-15 rounded-full flex items-center justify-center text-white -translate-y-1"
                  style={{
                    background: "linear-gradient(135deg, #D946EF, #4C1D95)",
                    boxShadow:
                      "0 6px 24px -4px color-mix(in oklch, #E879F9 70%, transparent), 0 0 0 6px #0a0a0a",
                  }}
                >
                  <Icon size={26} />
                </div>
              </div>
            );
          }

          if (isActive) {
            return (
              <div
                className={
                  "flex flex-col justify-center items-center gap-1 isActive pt-2 px-1 pb-1"
                }
                style={{ color: clientConfig.ui.primary_color }}
                key={index}
              >
                <Icon size={24} />
                <span className="text-sm">{navbar.title}</span>
              </div>
            );
          }

          return (
            <Link
              href={targetPath}
              className="flex flex-col justify-center items-center gap-1 pt-2 px-1 pb-1"
              style={{ color: clientConfig.ui.text_gray_color }}
              key={index}
            >
              <Icon size={24} />
              <span className="text-sm">{navbar.title}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
