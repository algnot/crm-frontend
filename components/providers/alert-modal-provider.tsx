"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export type OpenAlertOptions = {
  title?: string;
  message: string;
  confirmText?: string;
  primaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  icon?: ReactNode;
};

type AlertModalContextType = {
  openAlert: (options: OpenAlertOptions) => Promise<void>;
  closeAlert: () => void;
  setFullLoading: (value: boolean) => void;
};

const AlertModalContext = createContext<AlertModalContextType | null>(null);

function AlertModal({
  options,
  onClose,
}: {
  options: OpenAlertOptions;
  onClose: () => void;
}) {
  const {
    title = "แจ้งเตือน",
    message,
    confirmText = "ตกลง",
    primaryColor = "#7C3AED",
    backgroundColor = "#FFFFFF",
    textColor = "#111827",
  } = options;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/45 px-4 pb-4 pt-10"
      style={{ zIndex: 200 }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm overflow-hidden rounded-[28px] shadow-2xl"
        style={{
          background: backgroundColor,
          color: textColor,
          paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="px-5 pb-4 pt-5 text-center">
          {options.icon && (
            <div
              className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full"
              style={{ background: `${primaryColor}1A`, color: primaryColor }}
            >
              {options.icon}
            </div>
          )}

          <h3 className="text-lg font-semibold leading-6">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-black/65">{message}</p>
        </div>

        <div className="px-5 pt-1">
          <button
            type="button"
            className="w-full rounded-2xl px-4 py-3 text-sm font-medium text-white active:scale-[0.99]"
            style={{ background: primaryColor }}
            onClick={onClose}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export function AlertModalProvider({ children }: { children: ReactNode }) {
  const [alertOptions, setAlertOptions] = useState<OpenAlertOptions | null>(
    null,
  );
  const resolverRef = useRef<(() => void) | null>(null);
  const previousOverflowRef = useRef<string | null>(null);

  const closeAlert = useCallback(() => {
    setAlertOptions(null);
    resolverRef.current?.();
    resolverRef.current = null;
  }, []);

  const openAlert = useCallback((options: OpenAlertOptions) => {
    if (resolverRef.current) {
      resolverRef.current();
      resolverRef.current = null;
    }

    setAlertOptions(options);

    return new Promise<void>((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  useEffect(() => {
    if (alertOptions && previousOverflowRef.current === null) {
      previousOverflowRef.current = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }

    if (!alertOptions && previousOverflowRef.current !== null) {
      document.body.style.overflow = previousOverflowRef.current;
      previousOverflowRef.current = null;
    }
  }, [alertOptions]);

  useEffect(() => {
    return () => {
      if (previousOverflowRef.current !== null) {
        document.body.style.overflow = previousOverflowRef.current;
        previousOverflowRef.current = null;
      }
      resolverRef.current?.();
      resolverRef.current = null;
    };
  }, []);

  return (
    <AlertModalContext.Provider
      value={{ openAlert, closeAlert, setFullLoading: () => {} }}
    >
      {alertOptions && (
        <AlertModal options={alertOptions} onClose={closeAlert} />
      )}
      {children}
    </AlertModalContext.Provider>
  );
}

export function useAlertModalContext() {
  const context = useContext(AlertModalContext);
  if (!context) {
    throw new Error(
      "useAlertModalContext must be used within AlertModalProvider",
    );
  }
  return context;
}
