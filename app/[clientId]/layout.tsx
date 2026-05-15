"use client";
import Navbar from "@/components/navbar";
import { useApp } from "@/components/providers/app-provider";
import { isErrorResponse } from "@/types/request";
import { getLiffUserProfile } from "@/util/line-liff";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const params = useParams();
  const [isWaiting, setIsWaiting] = useState<boolean>(true);
  const clientId = Array.isArray(params.clientId)
    ? params.clientId[0]
    : params.clientId;
  const { backendClient, setClientConfig, setUserProfile } = useApp();

  useEffect(() => {
    if (!clientId) return;

    const fetchData = async () => {
      const response = await backendClient.getPartnerAppConfig(clientId);
      if (isErrorResponse(response)) {
        window.location.href = "/";
        return;
      }
      setIsWaiting(false);
      setClientConfig(response);

      const liffProfile = await getLiffUserProfile(
        response?.line?.liff_id ?? "",
      );
      setUserProfile(liffProfile);
    };

    fetchData();
  }, []);

  if (isWaiting) {
    return;
  }

  return (
    <div lang="en">
      <div className="container">{children}</div>
      <Navbar />
    </div>
  );
}
