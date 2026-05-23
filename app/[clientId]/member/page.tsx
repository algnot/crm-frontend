"use client";
import Button from "@/components/button";
import { useApp } from "@/components/providers/app-provider";
import { IconLogout } from "@tabler/icons-react";

export default function Page() {
  const { userProfile, clientConfig, appUserProfile, setFullLoading } =
    useApp();
  return (
    <div className="p-5">
      <div className="flex flex-col justify-center items-center mb-5">
        {!!userProfile?.pictureUrl ? (
          <div
            className="bg-white rounded-full w-fit h-fit item-center border-2"
            style={{ borderColor: clientConfig.ui.primary_color }}
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
          <div className="text-2xl">{userProfile?.displayName}</div>
          <div
            className="text-sm"
            style={{ color: clientConfig.ui.text_gray_color }}
          >
            เลขสมาชิก: {userProfile?.userId}
          </div>
        </div>
      </div>
      <div
        className="rounded-[18px] border-[0.5px] border-[rgba(255,255,255,0.08)]"
        style={{
          background: clientConfig.ui.ui_custom_fields.find(
            (field) => field.key === "surface_color",
          )?.value,
          color: clientConfig.ui.text_color,
        }}
      >
        <p
          className="pt-3 px-4 pb-1.5"
          style={{
            color: clientConfig.ui.text_gray_color,
          }}
        >
          ข้อมูลส่วนตัว
        </p>
        <div className="text-md flex justify-between py-3 px-4 border-b-[0.5px] border-[rgba(255,255,255,0.08)]">
          <div className="font-medium">ชื่อ-นามสกุล</div>
          <div className="text-gray-500">
            {appUserProfile?.display_name || "-"}
          </div>
        </div>
        <div className="text-md flex justify-between py-3 px-4 border-b-[0.5px] border-[rgba(255,255,255,0.08)]">
          <div className="font-medium">อีเมล</div>
          <div className="text-gray-500">{appUserProfile?.email || "-"}</div>
        </div>
        <div className="text-md flex justify-between py-3 px-4 border-b-[0.5px] border-[rgba(255,255,255,0.08)]">
          <div className="font-medium">เบอร์โทร</div>
          <div className="text-gray-500">{appUserProfile?.phone || "-"}</div>
        </div>
        <div className="text-md flex justify-between py-3 px-4 border-b-[0.5px] border-[rgba(255,255,255,0.08)]">
          <div className="font-medium">วันเกิด</div>
          <div className="text-gray-500">
            {appUserProfile?.birth_date || "-"}
          </div>
        </div>
        <div className="text-md flex justify-between py-3 px-4 border-b-[0.5px] border-[rgba(255,255,255,0.08)]">
          <div className="font-medium">เพศ</div>
          <div className="text-gray-500">{appUserProfile?.gender || "-"}</div>
        </div>
        <div className="text-md flex justify-between py-3 px-4">
          <div className="font-medium">ที่อยู่จัดส่ง</div>
          <div className="text-gray-500">{"-"}</div>
        </div>
      </div>
      <div
        className="h-12 rounded-[18px] border-[0.5px] border-[rgba(255,255,255,0.08)] flex items-center justify-center mt-6 cursor-pointer gap-2"
        style={{
          background: clientConfig.ui.ui_custom_fields.find(
            (field) => field.key === "surface_color",
          )?.value,
          color: clientConfig.ui.text_gray_color,
        }}
        onClick={async () => {
          setFullLoading(true);
          window.localStorage.clear();
          window.location.href = `/${clientConfig.slug}`;
        }}
      >
        <IconLogout size={18} /> ออกจากระบบ
      </div>
    </div>
  );
}
