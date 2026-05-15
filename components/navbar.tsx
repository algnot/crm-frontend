"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, GardenCart, Carrot, Ticket } from "tabler-icons-react";
import { useApp } from "./providers/app-provider";

const navbars = [
  {
    icon: Home,
    href: "/",
    title: "หน้าหลัก",
  },
  {
    icon: Ticket,
    href: "/coupon",
    title: "คูปอง",
  },
  {
    icon: User,
    href: "/member",
    title: "ผู้ใช้",
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const { clientConfig, appUserProfile } = useApp();

  const getHref = (href: string) =>
    href === "/" ? `/${clientConfig.slug}` : `/${clientConfig.slug}${href}`;

  if (
    typeof appUserProfile === "undefined" ||
    appUserProfile?.force_verify_phone ||
    appUserProfile?.force_verify_email
  ) {
    return;
  }

  return (
    <>
      <div style={{ height: 70 }}></div>
      <div className="navbar flex justify-around items-center px-5 shadow-md">
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
              className="flex flex-col justify-center items-center gap-0.5 text-gray-500"
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
