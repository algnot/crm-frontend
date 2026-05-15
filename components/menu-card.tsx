import { JSX } from "react";
import { Carrot, Star } from "tabler-icons-react";
import { useApp } from "./providers/app-provider";

interface Promotion {
  icon: JSX.Element;
  name: string;
}

interface MenuCardProp {
  name: string;
  rating: number;
  distance: string;
  promotions: Promotion[];
}

export default function MenuCard({
  name,
  rating,
  distance,
  promotions,
}: MenuCardProp) {
  const { clientConfig } = useApp();

  return (
    <div className="flex gap-3 p-3 mb-2 bg-white rounded-xl cursor-pointer">
      <div className="bg-white w-fit rounded-xl">
        <img src={clientConfig.logo_url} className="h-22 w-22 rounded-xl" />
      </div>
      <div className="flex flex-col justify-between">
        <div className="text-2xl">{name}</div>
        <div className="flex gap-1">
          <div className="text-md bg-primary text-white w-fit flex items-center justify-center gap-1 rounded-sm px-1">
            <Star size={14} /> {rating}
          </div>
          | {distance}
        </div>
        {promotions.map((promotion, index) => {
          return (
            <div
              key={index}
              className="text-sm mt-1 flex gap-1 items-center bg-gray-200 px-2 rounded-2xl"
            >
              {promotion.icon} {promotion.name}
            </div>
          );
        })}
      </div>
    </div>
  );
}
