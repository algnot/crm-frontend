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
  const {
    backendClient,
    clientConfig,
    userProfile,
    setClientConfig,
    setUserProfile,
    setAppUserProfile,
  } = useApp();

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

      if (liffProfile) {
        const appProfile = await backendClient.getOrCreateUser(
          clientId,
          liffProfile,
        );
        if (isErrorResponse(appProfile)) {
          window.location.href = `/${clientConfig.slug}`;
          return;
        }

        if (
          appProfile.force_verify_phone &&
          window.location.pathname !== `/${clientId}/verify-phone`
        ) {
          window.location.href = `/${clientId}/verify-phone`;
          return;
        }

        if (
          appProfile.force_verify_email &&
          window.location.pathname !== `/${clientId}/verify-email` &&
          window.location.pathname !== `/${clientId}/verify-phone`
        ) {
          window.location.href = `/${clientId}/verify-email`;
          return;
        }

        setAppUserProfile(appProfile);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!clientConfig.name) return;

    const { background_color } = clientConfig.ui;
    document.title = `${clientConfig.name} CRM`;
    document.body.style.backgroundColor = background_color;

    if (clientConfig.logo_url) {
      let favicon = document.querySelector(
        "link[rel='icon']",
      ) as HTMLLinkElement | null;

      if (!favicon) {
        favicon = document.createElement("link");
        favicon.rel = "icon";
        document.head.appendChild(favicon);
      }

      favicon.href = clientConfig.logo_url;
    }

    return () => {
      document.body.style.backgroundColor = "";
    };
  }, [
    clientConfig.name,
    clientConfig.logo_url,
    clientConfig.ui.background_color,
  ]);

  if (isWaiting || !clientConfig || !userProfile) {
    return;
  }

  return (
    <div
      className="min-h-dvh"
      style={{ backgroundColor: clientConfig.ui.background_color }}
    >
      {children}
      <Navbar />
    </div>
  );
}
