import React from "react";
import { useApp } from "./providers/app-provider";

interface InputProp {
  text: string;
  onClick: () => void;
  className?: string;
}

export default function Button({ text, className, onClick }: InputProp) {
  const { clientConfig } = useApp();
  return (
    <div
      className={
        className + " w-full text-center p-2 text-xl rounded-md cursor-pointer"
      }
      style={{
        backgroundColor: clientConfig.ui.button_color,
        color: clientConfig.ui.button_text_color,
      }}
      onClick={onClick}
    >
      {text}
    </div>
  );
}
