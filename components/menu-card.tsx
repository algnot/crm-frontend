import { GetUserPointHistoryRespont } from "@/types/request";
import { useApp } from "./providers/app-provider";

interface MenuCardProp {
  pointHistory: GetUserPointHistoryRespont;
}

export default function MenuCard({ pointHistory }: MenuCardProp) {
  const { clientConfig } = useApp();

  return (
    <div className="flex gap-3 p-3 mb-2 border-b-[0.5px] border-[rgba(255,255,255,0.08)]">
      <div className="flex gap-3 items-center">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{
            color:
              pointHistory.type === "earn"
                ? clientConfig.ui.text_success_color
                : clientConfig.ui.text_error_color,
            background:
              pointHistory.type === "earn"
                ? `${clientConfig.ui.text_success_color}33`
                : `${clientConfig.ui.text_error_color}33`,
          }}
        >
          i
        </div>
        <div className="flex flex-col">
          <div
            className="text-xl"
            style={{ color: clientConfig.ui.text_color }}
          >
            {pointHistory.name}
          </div>
          <div className="text-gray-500">{pointHistory.given_date}</div>
        </div>
      </div>
      <div className="ml-auto text-xl">
        {pointHistory.type === "earn" && (
          <div style={{ color: clientConfig.ui.text_success_color }}>
            + {pointHistory.value.toLocaleString()}
          </div>
        )}
        {pointHistory.type !== "earn" && (
          <div style={{ color: clientConfig.ui.text_error_color }}>
            - {pointHistory.value.toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
}
