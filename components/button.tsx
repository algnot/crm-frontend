import React, { JSX } from "react";
import { useApp } from "./providers/app-provider";

interface InputProp {
  text: string;
  onClick?: () => void;
  className?: string;
  icon?: JSX.Element;
  disabled?: boolean;
}

export default function Button({
  text,
  className,
  onClick,
  icon,
  disabled = false,
}: InputProp) {
  const { clientConfig } = useApp();

  const handleClick = () => {
    if (disabled) return;
    onClick?.();
  };

  return (
    <button
      type="button"
      disabled={disabled}
      className={`${className ?? ""} w-full text-center p-2 text-xl rounded-xl flex gap-3 justify-center items-center ${
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
      }`}
      style={{
        backgroundColor: clientConfig.ui.button_color,
        color: clientConfig.ui.button_text_color,
      }}
      onClick={handleClick}
    >
      {icon} {text}
    </button>
  );
}
