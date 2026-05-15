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
    href: "/user",
    title: "ผู้ใช้",
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const { clientConfig } = useApp();

  return (
    <>
      <div style={{ height: 70 }}></div>
      <div className="navbar flex justify-around items-center px-5">
        {navbars.map((navbar, index) => {
          const isActive = pathname === navbar.href;
          const Icon = navbar.icon;
          if (isActive) {
            return (
              <div
                className={
                  "flex flex-col justify-center items-center gap-0.5 isActive text-secondary"
                }
                key={index}
              >
                <Icon size={24} />
                <span className="text-sm">{navbar.title}</span>
              </div>
            );
          }

          return (
            <Link
              href={`${clientConfig.slug}/${navbar.href}`}
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
