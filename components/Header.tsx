import React from "react";
import Banner from "@/public/banner.jpg";
import { useApp } from "./providers/app-provider";
import { IconBell, IconQrcode } from "@tabler/icons-react";

export default function Header() {
  const { userProfile, clientConfig } = useApp();

  return (
    <div>
      <div className="relative h-80 -mb-45 pointer-events-none">
        <img
          src={Banner.src}
          alt="banner"
          className="absolute inset-0 w-full h-full object-cover block"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg,rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 30%, #0a0a0a 92%, #0a0a0a 100%)",
          }}
        ></div>
      </div>
      <header className="relative z-2 pt-16 px-4.5 pb-4.5 flex items-center justify-between">
        {!!clientConfig.logo_url && (
          <img
            src={clientConfig.logo_url}
            alt="logo"
            className="h-9.5 w-9.5 rounded-xl bg-black"
            style={{
              boxShadow:
                "0 0 0 0.5px rgba(255,255,255,0.06), 0 4px 18px -4px color-mix(in oklch, #E879F9 60%, transparent)",
            }}
          />
        )}
        <button
          className="w-9.5 h-9.5 rounded-xl flex items-center justify-center border border-[rgba(255,255,255,0.08)]"
          style={{ background: clientConfig.ui.background_color }}
        >
          <IconBell className="text-white w-5 h-5" />
        </button>
      </header>
      <div className="relative z-2 flex items-center gap-4 px-4.5 pb-5.5">
        {!!userProfile?.pictureUrl ? (
          <img
            src={userProfile.pictureUrl}
            className="h-12.5 w-12.5 rounded-full border border-[#E879F9]"
          />
        ) : (
          <img src={clientConfig.logo_url} className="h-12.5 w-12.5" />
        )}
        <div className="flex-1 min-w-0">
          <div
            className="text-lg mb-1 font-semibold tracking-[-0.17px]"
            style={{
              color: clientConfig.ui.text_white_color,
            }}
          >
            {clientConfig.ui.welcome_title || "ยินดีต้อนรับ"}
          </div>

          <div
            className="text-xs truncate"
            style={{
              color: clientConfig.ui.text_gray_color,
            }}
          >
            xxx-xxx-1234 {/* TODO: get phone number */}
          </div>
        </div>
        <button
          className="w-11 h-11 rounded-xl flex items-center justify-center border border-[rgba(255,255,255,0.08)]"
          style={{
            background: "linear-gradient(135deg, #D946EF, #4C1D95)",
            boxShadow:
              "0 6px 20px -4px color-mix(in oklch, #D946EF 70%, transparent)",
          }}
        >
          <IconQrcode className="text-white w-5.5 h-5.5" />
        </button>
      </div>
    </div>
  );
}
