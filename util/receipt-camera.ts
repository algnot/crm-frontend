"use client";

type ReceiptSubmitPayload = {
  receiptNumber: string;
  receiptImage: string;
};

type ReceiptSubmitResult =
  | void
  | boolean
  | {
      ok?: boolean;
      message?: string;
    };

type OpenReceiptOptions = {
  onSubmit?: (
    payload: ReceiptSubmitPayload,
  ) => Promise<ReceiptSubmitResult> | ReceiptSubmitResult;
  onClose?: () => void;
  primaryColor?: string;
  textWhiteColor?: string;
  textGrayColor?: string;
  backgroundWhiteColor?: string;
};

let overlayEl: HTMLDivElement | null = null;
let cameraStream: MediaStream | null = null;
let prevOverflow: string | null = null;

function stopCamera() {
  if (!cameraStream) return;
  cameraStream.getTracks().forEach((track) => track.stop());
  cameraStream = null;
}

export function closeReceipt() {
  stopCamera();

  if (overlayEl && overlayEl.parentElement) {
    overlayEl.parentElement.removeChild(overlayEl);
  }
  overlayEl = null;

  if (prevOverflow !== null) {
    document.body.style.overflow = prevOverflow;
    prevOverflow = null;
  }
}

export async function openReceipt(options: OpenReceiptOptions = {}) {
  if (typeof window === "undefined") return;

  closeReceipt();

  prevOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";

  const primaryColor = options.primaryColor || "#4C1D95";
  const textWhiteColor = options.textWhiteColor || "#FFFFFF";
  const textGrayColor = options.textGrayColor || "#9CA3AF";
  const backgroundWhiteColor = options.backgroundWhiteColor || "#FFFFFF";

  let receiptImage = "";
  let isSubmitting = false;

  overlayEl = document.createElement("div");
  overlayEl.className = "fixed inset-0 z-100 bg-black";

  const cameraView = document.createElement("div");
  cameraView.className = "relative w-full h-full";

  const videoEl = document.createElement("video");
  videoEl.className = "h-full w-full object-cover";
  videoEl.autoplay = true;
  videoEl.muted = true;
  videoEl.playsInline = true;

  const cameraErrorEl = document.createElement("div");
  cameraErrorEl.className =
    "absolute top-4 left-4 right-4 text-sm text-red-400 bg-red-900/30 rounded-lg p-3 hidden";

  const captureBtn = document.createElement("button");
  captureBtn.type = "button";
  captureBtn.className =
    "absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full w-16 h-16 flex items-center justify-center font-semibold border-4";
  captureBtn.style.background = primaryColor;
  captureBtn.style.color = textWhiteColor;
  captureBtn.style.borderColor = "rgba(255,255,255,0.3)";
  captureBtn.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-camera"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2" /><path d="M9 13a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" /></svg>';

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className =
    "absolute top-4 right-4 rounded-full w-10 h-10 flex items-center justify-center bg-black/50 text-white border border-white/30";
  closeBtn.textContent = "✕";

  const previewView = document.createElement("div");
  previewView.className = "relative w-full h-full flex flex-col hidden";

  const previewImg = document.createElement("img");
  previewImg.alt = "receipt-preview";
  previewImg.className = "flex-1 w-full object-contain bg-black";

  const controls = document.createElement("div");
  controls.className = "p-4 space-y-3";
  controls.style.background = backgroundWhiteColor;

  const label = document.createElement("label");
  label.className = "block text-sm font-medium";
  label.textContent = "เลขใบเสร็จ";

  const receiptInput = document.createElement("input");
  receiptInput.placeholder = "กรอกเลขใบเสร็จ";
  receiptInput.className = "w-full rounded-xl border px-4 py-3";
  receiptInput.style.borderColor = textGrayColor;

  const actions = document.createElement("div");
  actions.className = "grid grid-cols-3 gap-3";

  const retakeBtn = document.createElement("button");
  retakeBtn.type = "button";
  retakeBtn.className = "rounded-xl border px-4 py-3";
  retakeBtn.style.borderColor = textGrayColor;
  retakeBtn.textContent = "ถ่ายใหม่";

  const cancelBtn = document.createElement("button");
  cancelBtn.type = "button";
  cancelBtn.className = "rounded-xl border px-4 py-3";
  cancelBtn.style.borderColor = textGrayColor;
  cancelBtn.textContent = "ยกเลิก";

  const submitBtn = document.createElement("button");
  submitBtn.type = "button";
  submitBtn.className = "rounded-xl px-4 py-3 text-white";
  submitBtn.style.background = primaryColor;
  submitBtn.textContent = "ส่ง";

  const setSubmitting = (value: boolean) => {
    isSubmitting = value;
    submitBtn.disabled = value;
    cancelBtn.disabled = value;
    retakeBtn.disabled = value;
    submitBtn.textContent = value ? "ส่ง..." : "ส่ง";
  };

  const showCameraError = (message: string) => {
    cameraErrorEl.textContent = message;
    cameraErrorEl.classList.remove("hidden");
  };

  const hideCameraError = () => {
    cameraErrorEl.textContent = "";
    cameraErrorEl.classList.add("hidden");
  };

  const showCameraView = () => {
    cameraView.classList.remove("hidden");
    previewView.classList.add("hidden");
  };

  const showPreviewView = () => {
    cameraView.classList.add("hidden");
    previewView.classList.remove("hidden");
  };

  const startCamera = async () => {
    try {
      hideCameraError();
      stopCamera();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });

      cameraStream = stream;
      videoEl.srcObject = stream;
      await videoEl.play();
    } catch (err) {
      console.error(err);
      showCameraError("ไม่สามารถเปิดกล้องได้");
    }
  };

  captureBtn.onclick = async () => {
    try {
      if (!videoEl.videoWidth || !videoEl.videoHeight) return;

      const canvas = document.createElement("canvas");
      canvas.width = videoEl.videoWidth;
      canvas.height = videoEl.videoHeight;

      const context = canvas.getContext("2d");
      if (!context) return;

      context.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      receiptImage = dataUrl.replace(/^data:image\/\w+;base64,/, "");

      previewImg.src = `data:image/jpeg;base64,${receiptImage}`;
      stopCamera();
      showPreviewView();
    } catch (err) {
      console.error(err);
      window.alert("ไม่สามารถถ่ายรูปได้");
    }
  };

  const handleClose = () => {
    closeReceipt();
    options.onClose?.();
  };

  closeBtn.onclick = handleClose;
  cancelBtn.onclick = handleClose;

  retakeBtn.onclick = async () => {
    if (isSubmitting) return;
    receiptImage = "";
    showCameraView();
    await startCamera();
  };

  submitBtn.onclick = async () => {
    if (isSubmitting) return;

    const receiptNumber = receiptInput.value.trim();

    if (!receiptNumber) {
      window.alert("กรุณากรอกเลขใบเสร็จ");
      return;
    }

    if (!receiptImage) {
      window.alert("กรุณาถ่ายรูปใบเสร็จ");
      return;
    }

    try {
      setSubmitting(true);

      const result = await options.onSubmit?.({
        receiptNumber,
        receiptImage,
      });

      if (result === false) return;

      if (typeof result === "object" && result?.ok === false) {
        if (result.message) {
          window.alert(result.message);
        }
        return;
      }

      window.alert("ส่งใบเสร็จเรียบร้อย");
      handleClose();
    } catch (err) {
      console.error(err);
      window.alert("เกิดข้อผิดพลาดขณะส่งใบเสร็จ");
    } finally {
      setSubmitting(false);
    }
  };

  cameraView.appendChild(videoEl);
  cameraView.appendChild(cameraErrorEl);
  cameraView.appendChild(captureBtn);
  cameraView.appendChild(closeBtn);

  actions.appendChild(retakeBtn);
  actions.appendChild(cancelBtn);
  actions.appendChild(submitBtn);

  controls.appendChild(label);
  controls.appendChild(receiptInput);
  controls.appendChild(actions);

  previewView.appendChild(previewImg);
  previewView.appendChild(controls);

  overlayEl.appendChild(cameraView);
  overlayEl.appendChild(previewView);

  document.body.appendChild(overlayEl);

  await startCamera();
}
