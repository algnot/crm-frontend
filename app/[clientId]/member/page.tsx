"use client";
import Button from "@/components/button";
import { useApp } from "@/components/providers/app-provider";

export default function Page() {
  const { userProfile, clientConfig, appUserProfile, setFullLoading } =
    useApp();
  return (
    <div className="p-5">
      <div className="bg-white rounded-md shadow-md p-5">
        <div className="flex items-center gap-4">
          {!!userProfile?.pictureUrl ? (
            <div
              className="bg-white rounded-full w-fit h-fit item-center border-2"
              style={{ borderColor: clientConfig.ui.primary_color }}
            >
              <img
                src={userProfile?.pictureUrl}
                className="h-14 w-14 rounded-full"
              />
            </div>
          ) : (
            <div className="bg-white p-2 rounded-full w-fit h-fit item-center">
              <img src={clientConfig.logo_url} className="h-10 w-10" />
            </div>
          )}
          <div style={{ color: clientConfig.ui.text_color }}>
            <div className="text-2xl">{userProfile?.displayName}</div>
            <div className="text-sm text-gray-400">
              เลขสมาชิก: {userProfile?.userId}
            </div>
          </div>
        </div>

        <div className="text-md mt-6 flex justify-between">
          <div className="font-medium">อีเมล</div>
          <div className="text-gray-500">{appUserProfile?.email}</div>
        </div>
        <div className="text-md mt-1 flex justify-between">
          <div className="font-medium">หมายเลขโทรศัพท์</div>
          <div className="text-gray-500">{appUserProfile?.phone}</div>
        </div>
        <div className="text-md mt-1 flex justify-between">
          <div className="font-medium">วันเกิด</div>
          <div className="text-gray-500">
            {appUserProfile?.birth_date || "-"}
          </div>
        </div>
        <div className="text-md mt-1 flex justify-between">
          <div className="font-medium">เพศ</div>
          <div className="text-gray-500">{appUserProfile?.gender || "-"}</div>
        </div>

        <Button
          className="mt-6"
          text="ออกจากระบบ"
          onClick={async () => {
            setFullLoading(true);
            window.localStorage.clear();
            window.location.href = `/${clientConfig.slug}`;
          }}
        />
      </div>
    </div>
  );
}
