import { ErrorResponse, PartnerAppConfig } from "@/types/request";
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
}
