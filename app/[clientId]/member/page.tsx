"use client";
import { useApp } from "@/components/providers/app-provider";
import SkeletonMember from "@/components/skeleton-member";
import { IconLogout } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export default function Page() {
  const { userProfile, clientConfig, appUserProfile } = useApp();

  const router = useRouter();

  if (!appUserProfile) return <SkeletonMember />;

  return (
    <div className="p-5">
      <div
        className="text-3xl font-medium mt-5 mb-2 font-bodoni pb-4.5"
        style={{ color: clientConfig.ui.text_color }}
      >
        ตั้งค่าโปรไฟล์
      </div>

      <div className="flex flex-col justify-center items-center mb-5">
        {!!userProfile?.pictureUrl ? (
          <div
            className="bg-white rounded-full w-fit h-fit item-center border-2"
            style={{
              borderColor: `color-mix(in srgb, ${clientConfig.ui.primary_color} 80%, transparent)`,
            }}
          >
            <img
              src={userProfile?.pictureUrl}
              className="h-21 w-21 rounded-full"
            />
          </div>
        ) : (
          <div className="bg-white p-2 rounded-full w-fit h-fit item-center">
            <img src={clientConfig.logo_url} className="h-10 w-10" />
          </div>
        )}

        <div
          className="text-center"
          style={{ color: clientConfig.ui.text_color }}
        >
          <div className="text-[22px] font-medium font-bodoni my-1.5">
            {userProfile?.displayName}
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-fit px-2 py-0.5 rounded-full flex items-center gap-[5px] text-[10px] font-bold"
              style={{
                color: appUserProfile?.tier.color,
                border: `1px solid ${appUserProfile?.tier.color}`,
              }}
            >
              <div
                className="w-[5px] h-[5px] rounded-full"
                style={{
                  backgroundColor: appUserProfile?.tier.color,
                }}
              ></div>
              {appUserProfile?.tier.name}
            </div>
            <div
              className="text-xs font-mono"
              style={{ color: clientConfig.ui.text_gray_color }}
            >
              {userProfile?.userId}
            </div>
          </div>
        </div>
      </div>
      <div
        className="rounded-[18px] border-[0.5px]"
        style={{
          background: clientConfig.ui.surface_color,
          color: clientConfig.ui.text_color,
          borderColor: `color-mix(in srgb, ${clientConfig.ui.text_gray_color} 80%, transparent)`,
        }}
      >
        <p
          className="pt-3 px-4 pb-1.5 text-[10px]"
          style={{
            color: clientConfig.ui.text_gray_color,
          }}
        >
          ข้อมูลส่วนตัว
        </p>
        <div
          className="flex justify-between py-3 px-4 border-b-[0.5px]"
          style={{
            borderColor: `color-mix(in srgb, ${clientConfig.ui.text_gray_color} 80%, transparent)`,
          }}
        >
          <div className="font-medium text-sm">ชื่อ-นามสกุล</div>
          <div className="text-gray-500 text-xs font-mono">
            {appUserProfile?.display_name || "-"}
          </div>
        </div>
        <div
          className="text-md flex justify-between py-3 px-4 border-b-[0.5px]"
          style={{
            borderColor: `color-mix(in srgb, ${clientConfig.ui.text_gray_color} 80%, transparent)`,
          }}
        >
          <div className="font-medium text-sm">อีเมล</div>
          <div className="text-gray-500 text-xs font-mono">
            {appUserProfile?.email || "-"}
          </div>
        </div>
        <div
          className="text-md flex justify-between py-3 px-4 border-b-[0.5px]"
          style={{
            borderColor: `color-mix(in srgb, ${clientConfig.ui.text_gray_color} 80%, transparent)`,
          }}
        >
          <div className="font-medium text-sm">เบอร์โทร</div>
          <div className="text-gray-500 text-xs font-mono">
            {appUserProfile?.phone || "-"}
          </div>
        </div>
        <div
          className="text-md flex justify-between py-3 px-4 border-b-[0.5px]"
          style={{
            borderColor: `color-mix(in srgb, ${clientConfig.ui.text_gray_color} 80%, transparent)`,
          }}
        >
          <div className="font-medium text-sm">วันเกิด</div>
          <div className="text-gray-500 text-xs font-mono">
            {appUserProfile?.birth_date || "-"}
          </div>
        </div>
        <div
          className="text-md flex justify-between py-3 px-4 border-b-[0.5px]"
          style={{
            borderColor: `color-mix(in srgb, ${clientConfig.ui.text_gray_color} 80%, transparent)`,
          }}
        >
          <div className="font-medium text-sm">เพศ</div>
          <div className="text-gray-500 text-xs font-mono">
            {appUserProfile?.gender || "-"}
          </div>
        </div>
        <div
          className="text-md flex justify-between py-3 px-4"
          style={{
            borderColor: `color-mix(in srgb, ${clientConfig.ui.text_gray_color} 80%, transparent)`,
          }}
        >
          <div className="font-medium text-sm">ที่อยู่จัดส่ง</div>
          <div className="text-gray-500 text-xs font-mono">{"-"}</div>
        </div>
      </div>
      <div
        className="h-12 rounded-[18px] border-[0.5px] flex items-center justify-center mt-6 cursor-pointer gap-2 text-[13px]"
        style={{
          background: clientConfig.ui.surface_color,
          color: clientConfig.ui.text_gray_color,
          borderColor: `color-mix(in srgb, ${clientConfig.ui.text_gray_color} 80%, transparent)`,
        }}
        onClick={async () => {
          window.localStorage.clear();
          router.push(`/${clientConfig.slug}`);
        }}
      >
        <IconLogout size={18} /> ออกจากระบบ
      </div>
    </div>
  );
}
