import { GetUserPointHistoryRespont } from "@/types/request";
import { useApp } from "./providers/app-provider";

interface MenuCardProp {
  pointHistory: GetUserPointHistoryRespont;
}

export default function MenuCard({ pointHistory }: MenuCardProp) {
  const { clientConfig } = useApp();

  return (
    <div className="flex gap-3 p-3 mb-2 border-b-[0.5px] border-[rgba(255,255,255,0.08)]">
      <div className="flex flex-col">
        <div className="text-xl">{pointHistory.name}</div>
        <div className="text-gray-500">{pointHistory.given_date}</div>
      </div>
      <div className="ml-auto">
        {pointHistory.type === "earn" && (
          <div style={{ color: clientConfig.ui.text_success_color }}>
            ได้รับ {pointHistory.value.toLocaleString()}{" "}
            {pointHistory.currency.name}
          </div>
        )}
        {pointHistory.type !== "earn" && (
          <div style={{ color: clientConfig.ui.text_error_color }}>
            ใช้ {pointHistory.value.toLocaleString()}{" "}
            {pointHistory.currency.name}
          </div>
        )}
      </div>
    </div>
  );
}
