"use client";
import type { Profile } from "@liff/get-profile";
import { createContext, ReactNode, useContext, useState } from "react";
import { useFullLoadingContext } from "./full-loading-provider";
import { BackendClient } from "@/util/request";
import { initPartnerAppConfig, PartnerAppConfig, User } from "@/types/request";

interface AppContextType {
  userProfile: Profile | undefined;
  setUserProfile: (value: Profile | undefined) => void;
  setFullLoading: (value: boolean) => void;
  backendClient: BackendClient;
  clientConfig: PartnerAppConfig;
  setClientConfig: (value: PartnerAppConfig) => void;
  appUserProfile: User | undefined;
  setAppUserProfile: (value: User | undefined) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [userProfile, setUserProfile] = useState<Profile | undefined>();
  const [appUserProfile, setAppUserProfile] = useState<User | undefined>();
  const [clientConfig, setClientConfig] = useState<PartnerAppConfig>(
    initPartnerAppConfig(),
  );
  const setFullLoading = useFullLoadingContext();
  const backendClient = new BackendClient(setFullLoading);

  const value: AppContextType = {
    userProfile,
    setFullLoading,
    backendClient,
    clientConfig,
    setClientConfig,
    setUserProfile,
    appUserProfile,
    setAppUserProfile,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};
