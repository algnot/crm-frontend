"use client";

import { Html5Qrcode } from "html5-qrcode/esm/html5-qrcode";

type OpenOptions = {
  onResult?: (decodedText: string) => void | Promise<void>;
  onClose?: () => void;
  title?: string;
  subtitle?: string;
  primaryColor?: string;
  secondaryColor?: string;
  textWhiteColor?: string;
};

let scanner: Html5Qrcode | null = null;
let overlayEl: HTMLDivElement | null = null;
let prevOverflow: string | null = null;

export function closeScanner() {
  try {
    if (scanner) {
      if ((scanner as any).isScanning) {
        // stop may throw if already stopped
        // eslint-disable-next-line no-void
        void scanner.stop();
      }
      scanner.clear();
    }
  } catch (e) {
    console.error(e);
  }

  scanner = null;

  if (overlayEl && overlayEl.parentElement) {
    overlayEl.parentElement.removeChild(overlayEl);
  }
  overlayEl = null;

  if (prevOverflow !== null) {
    document.body.style.overflow = prevOverflow;
    prevOverflow = null;
  }
}

export async function openScanner(options: OpenOptions = {}) {
  if (typeof window === "undefined") return;

  // close existing first
  closeScanner();

  prevOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";

  overlayEl = document.createElement("div");
  overlayEl.className =
    "qr-scanner-overlay fixed inset-0 z-100 h-dvh w-full bg-black overflow-hidden";

  const closeBtn = document.createElement("button");
  closeBtn.className =
    "absolute top-4 right-4 z-20 rounded-full p-2 cursor-pointer w-8 h-8";
  closeBtn.style.background = options.primaryColor || "#4C1D95";
  closeBtn.style.color = options.textWhiteColor || "#fff";
  closeBtn.innerHTML = "✕";
  closeBtn.onclick = () => {
    closeScanner();
    options.onClose?.();
  };

  const reader = document.createElement("div");
  reader.id = "qr-reader-utility";
  reader.className = "absolute inset-0 w-full h-full min-h-0";

  const footer = document.createElement("div");
  footer.className =
    "absolute bottom-8 inset-x-0 z-20 flex justify-center px-4";
  footer.innerHTML = `
    <div class="text-2xl text-center px-5 py-2 rounded-md" style="background: ${options.secondaryColor || "#6b21a8"}; color: ${options.textWhiteColor || "#fff"}">
      ${options.title || "สแกน QR Code"}<br/>${options.subtitle || "กรุณาวาง QR Code ให้อยู่ในกรอบ"}
    </div>
  `;

  overlayEl.appendChild(closeBtn);
  overlayEl.appendChild(reader);
  overlayEl.appendChild(footer);

  document.body.appendChild(overlayEl);

  scanner = new Html5Qrcode("qr-reader-utility");

  try {
    await scanner.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
          const size = Math.floor(
            Math.min(viewfinderWidth, viewfinderHeight) * 0.7,
          );
          return { width: size, height: size };
        },
      },
      (decodedText: string) => {
        try {
          options.onResult?.(decodedText);
        } catch (e) {
          console.error(e);
        }
      },
      (error) => {
        // ignore per-frame scan errors
      },
    );
  } catch (err) {
    console.error(err);
    closeScanner();
  }
}
