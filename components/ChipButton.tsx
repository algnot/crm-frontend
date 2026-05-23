"use client";
import React, { ReactNode } from "react";
import { useApp } from "./providers/app-provider";

interface ChipButtonProps {
  label?: ReactNode;
  selected?: boolean; // controlled
  onSelect?: (selected: boolean) => void;
  disabled?: boolean;
}

export default function ChipButton({
  label,
  selected,
  onSelect,
  disabled = false,
}: ChipButtonProps) {
  const { clientConfig } = useApp();

  return (
    <div
      onClick={onSelect ? () => onSelect(!selected) : undefined}
      className="px-4 py-1 rounded-xl cursor-pointer"
      style={{
        backgroundColor: selected
          ? clientConfig.ui.secondary_color
          : clientConfig.ui.ui_custom_fields.find(
              (field) => field.key === "surface_color",
            )?.value,
        color: selected
          ? clientConfig.ui.text_white_color
          : clientConfig.ui.text_color,
      }}
    >
      {label}
    </div>
  );
}
