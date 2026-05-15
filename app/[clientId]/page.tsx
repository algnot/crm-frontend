"use client";
import Card from "@/components/card";
import MenuCard from "@/components/menu-card";
import { useApp } from "@/components/providers/app-provider";
import { Award, Carrot, User } from "tabler-icons-react";

export default function Home() {
  const { userProfile, clientConfig } = useApp();

  return (
    <div className="h-dvh flex flex-col overflow-hidden">
      <div className="p-5 shrink-0">
        <div className="flex justify-between items-center bg-white p-2 px-5 rounded-md shadow-md">
          <div className="flex gap-4">
            {!!userProfile?.pictureUrl ? (
              <div
                className="bg-white rounded-full w-fit h-fit item-center border-2"
                style={{ borderColor: clientConfig.ui.button_color }}
              >
                <img
                  src={userProfile?.pictureUrl}
                  className="h-13 w-13 rounded-full"
                />
              </div>
            ) : (
              <div className="bg-white p-2 rounded-full w-fit h-fit item-center">
                <img src={clientConfig.logo_url} className="h-10 w-10" />
              </div>
            )}
            <div className="text-3xl md:text-4xl">
              <div
                className="text-secondary text-[18px]"
                style={{ color: clientConfig.ui.button_color }}
              >
                {clientConfig.ui.welcome_title || "ยินดีต้อนรับ"}
              </div>
              <div className="text-2xl">{userProfile?.displayName}</div>
            </div>
          </div>
          <div className="">
            {!!clientConfig.logo_url && (
              <img src={clientConfig.logo_url} className="h-20 w-20" />
            )}
          </div>
        </div>

        <div className="flex mt-4 gap-3">
          <Card
            title={
              <>
                <Award /> คะแนนของคุณ
              </>
            }
            value={
              <>
                <div className="text-xl">9,999,999</div>
              </>
            }
            className="bg-primary shadow-md"
          />
          <Card
            title={
              <>
                <User /> ระดับสมาชิก
              </>
            }
            value={
              <>
                <div className="text-xl">new member</div>
              </>
            }
            style={{
              backgroundColor: clientConfig.ui.button_color,
              color: clientConfig.ui.button_text_color,
            }}
            className="shadow-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5">
        <MenuCard
          name="กะเพราบิลเลี่ยน"
          rating={4.7}
          distance="4.7 km"
          promotions={[
            {
              icon: <Carrot size={15} />,
              name: "สั่งครั้งแรกคะแนนคูณ 2",
            },
          ]}
        />
      </div>
    </div>
  );
}
