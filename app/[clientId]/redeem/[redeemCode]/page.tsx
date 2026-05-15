"use client";
import Button from "@/components/button";
import { useApp } from "@/components/providers/app-provider";
import { isErrorResponse, Redeem } from "@/types/request";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const params = useParams();
  const { backendClient, clientConfig, userProfile } = useApp();
  const redeemCode = Array.isArray(params.redeemCode)
    ? params.redeemCode[0]
    : params.redeemCode;
  const [redeemDetail, setRedeemDetail] = useState<Redeem>();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (!redeemCode) {
      return;
    }

    const redeemDetail = await backendClient.getRedeemDetail(
      clientConfig.slug,
      redeemCode,
    );
    if (isErrorResponse(redeemDetail)) {
      window.location.href = `/${clientConfig.slug}`;
      return;
    }
    if (redeemDetail) {
      setRedeemDetail(redeemDetail);
    }
  };

  const onReedeem = async () => {
    if (!redeemCode || !userProfile?.userId) {
      return;
    }

    const response = await backendClient.redeemCode(
      clientConfig.slug,
      redeemCode,
      userProfile?.userId,
    );

    if (isErrorResponse(response)) {
      alert(response.message);
      window.location.href = `/${clientConfig.slug}`;
      return;
    }

    alert("สะสมคะแนนสำเร็จแล้ว!");
    window.location.href = `/${clientConfig.slug}`;
  };

  return (
    <div>
      <div className="p-5">
        <div className="bg-white rounded-md shadow-md p-5">
          <div className="flex items-center gap-4">
            <div className="bg-white p-2 rounded-full w-fit h-fit item-center">
              <img src={clientConfig.logo_url} className="h-10 w-10" />
            </div>
            <div style={{ color: clientConfig.ui.text_color }}>
              <div className="text-2xl">{redeemDetail?.name}</div>
              <div className="text-sm text-gray-400">{redeemDetail?.code}</div>
            </div>
          </div>

          <div className="text-md mt-6 flex justify-between">
            <div className="font-medium">จำนวน</div>
            <div className="text-gray-500">
              {redeemDetail?.value.toLocaleString()}{" "}
              {redeemDetail?.currency.name}
            </div>
          </div>
          <div className="text-md mt-1 flex justify-between">
            <div className="font-medium">จำกัดต่อ user</div>
            <div className="text-gray-500">
              {redeemDetail?.limit_per_user} ครั้ง
            </div>
          </div>
          <div className="text-md mt-1 flex justify-between">
            <div className="font-medium">จำกัดต่อ QR Code</div>
            <div className="text-gray-500">
              {redeemDetail?.limit_per_qr.toLocaleString()} ครั้ง
            </div>
          </div>
          <div className="text-md mt-1 flex justify-between">
            <div className="font-medium">คงเหลือที่ใช้ได้</div>
            <div className="text-gray-500">
              {(
                (redeemDetail?.limit_per_qr || 0) -
                (redeemDetail?.redeemed_count || 0)
              ).toLocaleString()}{" "}
              ครั้ง
            </div>
          </div>

          <Button className="mt-6" text="สะสมคะแนน" onClick={onReedeem} />
        </div>
      </div>
    </div>
  );
}
