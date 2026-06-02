"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { useApp } from "@/components/providers/app-provider";
import { isErrorResponse } from "@/types/request";
import { useEffect, useRef, useState } from "react";
import { Phone } from "tabler-icons-react";

export default function Page() {
  const { clientConfig, userProfile, backendClient } = useApp();

  const [phone, setPhone] = useState("");
  const [ref, setRef] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const sendOtp = async () => {
    const cleanedPhone = phone.replace(/\D/g, "");

    if (!/^0\d{9}$/.test(cleanedPhone)) {
      alert("กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง");
      return;
    }

    setStep("otp");
    if (!userProfile?.userId) {
      return;
    }
    const response = await backendClient.submitPhone(clientConfig.slug, {
      phone: phone,
      userId: userProfile?.userId ?? "",
    });
    if (isErrorResponse(response)) {
      return;
    }
    setRef(response.ref);
    setCountdown(30);
  };

  const verifyOtp = async () => {
    const code = otp.join("");

    if (code.length !== 6) {
      alert("กรอก OTP ให้ครบ");
      return;
    }

    const response = await backendClient.verifyPhone(clientConfig.slug, {
      otp: code,
      ref: ref,
    });
    if (isErrorResponse(response)) {
      return;
    }

    window.location.href = `/${clientConfig.slug}`;
  };

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);

    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  if (!userProfile) return null;

  return (
    <div className="min-h-screen flex flex-col items-center px-10">
      <div className="pt-7 pb-3">
        {!!clientConfig.logo_url && (
          <img
            src={clientConfig.logo_url}
            alt="logo"
            className="h-[68px] w-auto rounded-[18px] bg-white"
            style={{
              boxShadow: `0 0 0 0.5px rgba(255,255,255,0.06), 0 4px 18px -4px color-mix(in oklch, ${clientConfig.ui.primary_color} 60%, transparent)`,
            }}
          />
        )}
      </div>

      <div
        className="text-xl mb-2 text-center"
        style={{
          color: clientConfig.ui.primary_color,
        }}
      >
        {clientConfig.name} MEMBER
      </div>

      {step === "phone" && (
        <>
          <div
            className="text-xl mb-5 text-center leading-[1.2]"
            style={{
              color: clientConfig.ui.text_gray_color,
            }}
          >
            เข้าสู่ระบบด้วยเบอร์โทรศัพท์ของคุณ <br />
            เพื่อสะสมพ้อยท์และแลกสิทธิประโยชน์
          </div>

          <div className="flex w-full bg-white p-4 rounded-md shadow">
            {!!userProfile.pictureUrl && (
              <img
                src={userProfile.pictureUrl}
                className="w-14 h-14 rounded-full"
              />
            )}

            <div className="ml-4">
              <div
                style={{
                  color: clientConfig.ui.primary_color,
                }}
              >
                ข้อมูลสมาชิก
              </div>

              <div className="text-2xl">{userProfile.displayName}</div>
            </div>
          </div>

          <Input
            type="text"
            storageKey="verify-phone"
            value={phone}
            onChange={setPhone}
            icon={<Phone />}
            inputMode="numeric"
            className="mt-5"
            placeholder="เบอร์โทรศัพท์"
          />

          <button
            style={{
              background: `linear-gradient(135deg, ${clientConfig.ui.primary_color}, ${clientConfig.ui.secondary_color})`,
              boxShadow: `0 8px 24px -6px color-mix(in oklch,${clientConfig.ui.primary_color} 60%, transparent)`,
              color: clientConfig.ui.button_text_color,
            }}
            className="mt-5 h-14 w-full text-center p-2 text-xl rounded-[14px] cursor-pointer flex gap-3 justify-center items-center"
            onClick={sendOtp}
          >
            ขอรหัส OTP
          </button>
        </>
      )}

      {step === "otp" && (
        <>
          <div
            className="text-xl text-center"
            style={{
              color: clientConfig.ui.text_gray_color,
            }}
          >
            ส่ง OTP ไปที่ <b>{phone}</b> เรียบร้อยแล้ว OTP มีอายุ 15 นาที (ref:{" "}
            {ref})
          </div>

          <div className="flex gap-2 mt-5">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                value={digit}
                maxLength={1}
                inputMode="numeric"
                onChange={(e) => handleOtpChange(e.target.value, index)}
                onKeyDown={(e) => handleBackspace(e, index)}
                className="w-12 h-12 shadow-md rounded-lg text-center text-2xl font-bold outline-none"
                style={{
                  borderColor: clientConfig.ui.primary_color,
                  background: clientConfig.ui.ui_custom_fields.find(
                    (field) => field.key === "surface_color",
                  )?.value,
                  border: `0.5px solid rgba(255,255,255,0.08)`,
                }}
              />
            ))}
          </div>

          <Button text="ยืนยัน OTP" className="mt-6" onClick={verifyOtp} />

          {countdown > 0 ? (
            <div
              className="mt-4 text-md"
              style={{
                color: clientConfig.ui.text_gray_color,
              }}
            >
              ส่ง OTP ใหม่ได้ใน {countdown} วินาที
            </div>
          ) : (
            <button
              className="mt-4 underline cursor-pointer"
              style={{
                color: clientConfig.ui.primary_color,
              }}
              onClick={sendOtp}
            >
              ส่ง OTP ใหม่
            </button>
          )}
        </>
      )}
    </div>
  );
}
