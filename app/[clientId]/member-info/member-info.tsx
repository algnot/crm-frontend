"use client";
import Input from "@/components/input";
import { useApp } from "@/components/providers/app-provider";
import { isErrorResponse } from "@/types/request";
import {
  getDistrictsByProvince,
  getProvinces,
  getSubDistrictsByDistrict,
  getZipCode,
  type District,
  type Province,
  type SubDistrict,
} from "@/util/thai-address";
import { IconChevronDown } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  IconUser,
  IconPhone,
  IconMail,
  IconCalendar,
  IconMapPin,
} from "@tabler/icons-react";

interface ThemedSelectProps {
  placeholder: string;
  options: { id: string; name: string }[];
  value: string;
  onChange: (id: string, name: string) => void;
  disabled?: boolean;
  label?: string;
}

function ThemedSelect({
  placeholder,
  options,
  value,
  onChange,
  disabled = false,
  label,
}: ThemedSelectProps) {
  const { clientConfig } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const selected = options.find((o) => o.id === value);

  return (
    <div className="w-full flex flex-col gap-2">
      {label && (
        <label className="block" style={{ color: clientConfig.ui.text_color }}>
          {label}
        </label>
      )}
      <div
        className={`h-14 rounded-[14px] shadow-md flex gap-3 px-3 items-center ${
          disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
        }`}
        style={{
          background: clientConfig.ui.surface_color,
          border: `0.5px solid rgba(255,255,255,0.08)`,
          color: clientConfig.ui.text_gray_color,
        }}
        onClick={() => !disabled && setIsOpen(true)}
      >
        <div className="flex-1 text-xl truncate">
          {selected ? (
            selected.name
          ) : (
            <span className="opacity-50">{placeholder}</span>
          )}
        </div>
        <IconChevronDown size={20} className="shrink-0" />
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl max-h-[70vh] overflow-hidden w-screen md:w-[500px] mx-auto">
            <div className="overflow-y-auto max-h-[calc(70vh-8px)]">
              {options.map((opt) => (
                <div
                  key={opt.id}
                  className={`px-5 py-4 cursor-pointer text-[15px] hover:bg-gray-100 transition-colors border-b border-gray-100 ${
                    value === opt.id ? "bg-gray-50 font-medium" : ""
                  }`}
                  onClick={() => {
                    onChange(opt.id, opt.name);
                    setIsOpen(false);
                  }}
                >
                  {opt.name}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const GENDER_OPTIONS = [
  { id: "male", name: "ชาย" },
  { id: "female", name: "หญิง" },
  { id: "other", name: "ไม่ระบุ" },
];

export default function MemberInfo() {
  const {
    clientConfig,
    userProfile,
    appUserProfile,
    backendClient,
    openAlert,
    setFullLoading,
  } = useApp();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState(appUserProfile?.email ?? "");
  const [phone, setPhone] = useState(appUserProfile?.phone ?? "");
  const [birthDate, setBirthDate] = useState(appUserProfile?.birth_date ?? "");

  const [provinceId, setProvinceId] = useState("");
  const [provinceName, setProvinceName] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [subDistrictId, setSubDistrictId] = useState("");
  const [subDistrictName, setSubDistrictName] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const provinces: Province[] = getProvinces();
  const districts: District[] = provinceId
    ? getDistrictsByProvince(provinceId)
    : [];
  const subDistricts: SubDistrict[] = districtId
    ? getSubDistrictsByDistrict(districtId)
    : [];

  const handleProvinceChange = (id: string, name: string) => {
    setProvinceId(id);
    setProvinceName(name);
    setDistrictId("");
    setDistrictName("");
    setSubDistrictId("");
    setSubDistrictName("");
    setPostalCode("");
  };

  const handleDistrictChange = (id: string, name: string) => {
    setDistrictId(id);
    setDistrictName(name);
    setSubDistrictId("");
    setSubDistrictName("");
    setPostalCode("");
  };

  const handleSubDistrictChange = (id: string, name: string) => {
    setSubDistrictId(id);
    setSubDistrictName(name);
    setPostalCode(getZipCode(id));
  };

  const handleSubmit = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      openAlert({
        title: "กรุณากรอกข้อมูล",
        message: "กรุณากรอกชื่อและนามสกุล",
      });
      return;
    }
    if (!gender) {
      openAlert({ title: "กรุณากรอกข้อมูล", message: "กรุณาเลือกเพศ" });
      return;
    }
    if (!userProfile?.userId) return;

    setFullLoading(true);
    const response = await backendClient.updateUserInfo(clientConfig.slug, {
      // first_name: firstName.trim(),
      // last_name: lastName.trim(),
      gender,
      birth_date: birthDate,
      // province: provinceName,
      // district: districtName,
      // sub_district: subDistrictName,
      // postal_code: postalCode,
    });
    setFullLoading(false);

    if (isErrorResponse(response)) {
      openAlert({ title: "เกิดข้อผิดพลาด", message: response.message });
      return;
    }

    router.push(`/${clientConfig.slug}`);
  };

  if (!userProfile) return null;

  return (
    <div className="min-h-screen flex flex-col px-5 pb-10">
      <div className="flex flex-col items-center pt-8 pb-6">
        <img
          src={clientConfig.logo_url}
          alt="logo"
          className="h-[56px] w-auto rounded-[14px] bg-white mb-4"
          style={{
            boxShadow: `0 0 0 0.5px rgba(255,255,255,0.06), 0 4px 18px -4px color-mix(in oklch, ${clientConfig.ui.primary_color} 60%, transparent)`,
          }}
        />
        <div
          className="text-xs font-bold font-mono mb-1"
          style={{ color: clientConfig.ui.primary_color }}
        >
          {clientConfig.name} MEMBER
        </div>
        <p
          className="font-bodoni text-2xl font-medium"
          style={{ color: clientConfig.ui.text_color }}
        >
          กรอกข้อมูลสมาชิก
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex gap-3">
          <Input
            value={firstName}
            onChange={setFirstName}
            placeholder="ชื่อ"
            icon={<IconUser size={20} />}
          />
          <Input
            value={lastName}
            onChange={setLastName}
            placeholder="นามสกุล"
          />
        </div>

        <ThemedSelect
          placeholder="เพศ"
          options={GENDER_OPTIONS}
          value={gender}
          onChange={(id) => setGender(id)}
        />

        <Input
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="อีเมล"
          icon={<IconMail size={20} />}
          disabled={!!appUserProfile?.email}
        />

        <Input
          type="tel"
          inputMode="tel"
          value={phone}
          onChange={setPhone}
          placeholder="เบอร์โทรศัพท์"
          icon={<IconPhone size={20} />}
          disabled={!!appUserProfile?.phone}
        />

        <Input
          type="date"
          value={birthDate}
          onChange={setBirthDate}
          placeholder="วันเกิด"
          icon={<IconCalendar size={20} />}
        />

        <div
          className="pt-1 pb-0.5 px-1 text-xs"
          style={{ color: clientConfig.ui.text_gray_color }}
        >
          ที่อยู่
        </div>

        <ThemedSelect
          placeholder="จังหวัด"
          options={provinces.map((p) => ({ id: p.id, name: p.name }))}
          value={provinceId}
          onChange={handleProvinceChange}
        />

        <ThemedSelect
          placeholder="อำเภอ / เขต"
          options={districts.map((d) => ({ id: d.id, name: d.name }))}
          value={districtId}
          onChange={handleDistrictChange}
          disabled={!provinceId}
        />

        <ThemedSelect
          placeholder="ตำบล / แขวง"
          options={subDistricts.map((s) => ({ id: s.id, name: s.name }))}
          value={subDistrictId}
          onChange={handleSubDistrictChange}
          disabled={!districtId}
        />

        <Input
          value={postalCode}
          onChange={setPostalCode}
          placeholder="รหัสไปรษณีย์"
          icon={<IconMapPin size={20} />}
          inputMode="numeric"
          maxLength={5}
        />
      </div>

      <button
        className="mt-6 h-14 w-full text-center text-[15px] rounded-[14px] cursor-pointer"
        style={{
          background: `linear-gradient(135deg, ${clientConfig.ui.primary_color}, ${clientConfig.ui.secondary_color})`,
          boxShadow: `0 8px 24px -6px color-mix(in oklch, ${clientConfig.ui.primary_color} 60%, transparent)`,
          color: clientConfig.ui.button_text_color,
        }}
        onClick={handleSubmit}
      >
        บันทึกข้อมูล
      </button>
    </div>
  );
}
