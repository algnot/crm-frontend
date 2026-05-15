import React, { JSX } from "react";
import { useApp } from "./providers/app-provider";

interface InputProp {
  text: string;
  onClick: () => void;
  className?: string;
  icon?: JSX.Element;
}

export default function Button({ text, className, onClick, icon }: InputProp) {
  const { clientConfig } = useApp();
  return (
    <div
      className={
        className +
        " w-full text-center p-2 text-xl rounded-md cursor-pointer flex gap-3 justify-center items-center"
      }
      style={{
        backgroundColor: clientConfig.ui.button_color,
        color: clientConfig.ui.button_text_color,
      }}
      onClick={onClick}
    >
      {icon} {text}
    </div>
  );
}
