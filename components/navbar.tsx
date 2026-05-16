"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Award, Ticket } from "tabler-icons-react";
import { useApp } from "./providers/app-provider";
import { IconSparkles } from "@tabler/icons-react";

const navbars = [
  {
    icon: Award,
    href: "/",
    title: "สะสมคะแนน",
  },
  {
    icon: IconSparkles,
    href: "/coupon",
    title: "สิทธิพิเศษ",
  },
  {
    icon: Ticket,
    href: "/coupon/my",
    title: "คูปองของฉัน",
  },
  {
    icon: User,
    href: "/member",
    title: "ผู้ใช้",
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
      <div style={{ height: 70 }}></div>
      <div
        className="navbar flex justify-around items-center px-5 shadow-md"
        style={{
          background: clientConfig.ui.background_white_color,
        }}
      >
        {navbars.map((navbar, index) => {
          const targetPath = getHref(navbar.href);
          const isActive = pathname === targetPath;
          const Icon = navbar.icon;

          if (isActive) {
            return (
              <div
                className={
                  "flex flex-col justify-center items-center gap-0.5 isActive"
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
              className="flex flex-col justify-center items-center gap-0.5"
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
