import { GetUserPointHistoryRespont } from "@/types/request";
import { useApp } from "./providers/app-provider";

interface MenuCardProp {
  pointHistory: GetUserPointHistoryRespont;
}

export default function MenuCard({ pointHistory }: MenuCardProp) {
  const { clientConfig } = useApp();

  return (
    <div className="flex gap-3 p-3 mb-2 bg-white rounded-xl shadow-md">
      <div className="flex flex-col">
        <div className="text-xl">{pointHistory.name}</div>
        <div>
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
      <div className="text-gray-500 ml-auto">{pointHistory.given_date}</div>
    </div>
  );
}
