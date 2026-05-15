import {
  ErrorResponse,
  PartnerAppConfig,
  SubmitPhoneRequest,
  SubmitPhoneResponse,
  User,
  VerifyPhoneRequest,
} from "@/types/request";
import { Profile } from "@liff/get-profile";
import axios, { AxiosInstance } from "axios";

const handlerError = (error: unknown): ErrorResponse => {
  if (axios.isAxiosError(error)) {
    if (error.status === 403) {
      return {
        error: "session_expired",
        message: "Session expired. Please login again.",
      };
    } else if (
      error.response &&
      error.response.data &&
      error.response.data.message
    ) {
      return {
        error: error.response.data.error,
        message: error.response.data.message,
      };
    } else {
      return {
        error: error.message,
        message: error.message,
      };
    }
  } else {
    return {
      error: "unkmown",
      message: "An unknow error occurred. try again!",
    };
  }
};

export class BackendClient {
  private readonly client: AxiosInstance;
  private readonly setLoading: (value: boolean) => void;

  constructor(setLoading: (value: boolean) => void) {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_BACKEND_PATH,
      headers: {
        "Content-Type": "application/json",
      },
    });
    this.setLoading = setLoading;
  }

  async getPartnerAppConfig(
    clientId: string,
  ): Promise<ErrorResponse | PartnerAppConfig> {
    try {
      this.setLoading(true);
      const response = await this.client.get(`/partner/${clientId}`);
      this.setLoading(false);
      return response.data;
    } catch (e) {
      this.setLoading(false);
      return handlerError(e);
    }
  }

  async getOrCreateUser(
    clientId: string,
    profile: Profile,
  ): Promise<ErrorResponse | User> {
    try {
      this.setLoading(true);
      const response = await this.client.post(
        `/partner/${clientId}/user`,
        profile,
      );
      this.setLoading(false);
      return response.data;
    } catch (e) {
      this.setLoading(false);
      return handlerError(e);
    }
  }

  async submitPhone(
    clientId: string,
    payload: SubmitPhoneRequest,
  ): Promise<ErrorResponse | SubmitPhoneResponse> {
    try {
      this.setLoading(true);
      const response = await this.client.post(
        `/partner/${clientId}/submit-phone`,
        payload,
      );
      this.setLoading(false);
      return response.data;
    } catch (e) {
      this.setLoading(false);
      return handlerError(e);
    }
  }

  async verifyPhone(
    clientId: string,
    payload: VerifyPhoneRequest,
  ): Promise<ErrorResponse | void> {
    try {
      this.setLoading(true);
      const response = await this.client.post(
        `/partner/${clientId}/verify-phone`,
        payload,
      );
      this.setLoading(false);
      return response.data;
    } catch (e) {
      this.setLoading(false);
      return handlerError(e);
    }
  }
}
