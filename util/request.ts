import {
  ErrorResponse,
  PartnerAppConfig,
  SubmitPhoneRequest,
  SubmitPhoneResponse,
  User,
  VerifyPhoneRequest,
  SubmitEmailRequest,
  SubmitEmailResponse,
  VerifyEmailRequest,
  GetUserPointRespont,
  GetUserPointHistoryRespont,
  Redeem,
  Coupon,
  UserCoupon,
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

  async submitEmail(
    clientId: string,
    payload: SubmitEmailRequest,
  ): Promise<ErrorResponse | SubmitEmailResponse> {
    try {
      this.setLoading(true);
      const response = await this.client.post(
        `/partner/${clientId}/submit-email`,
        payload,
      );
      this.setLoading(false);
      return response.data;
    } catch (e) {
      this.setLoading(false);
      return handlerError(e);
    }
  }

  async verifyEmail(
    clientId: string,
    payload: VerifyEmailRequest,
  ): Promise<ErrorResponse | void> {
    try {
      this.setLoading(true);
      const response = await this.client.post(
        `/partner/${clientId}/verify-email`,
        payload,
      );
      this.setLoading(false);
      return response.data;
    } catch (e) {
      this.setLoading(false);
      return handlerError(e);
    }
  }

  async getUserPoint(
    clientId: string,
    userId: string,
  ): Promise<ErrorResponse | GetUserPointRespont[]> {
    try {
      this.setLoading(true);
      const response = await this.client.get(
        `/partner/${clientId}/user/${userId}/point`,
      );
      this.setLoading(false);
      return response.data.points;
    } catch (e) {
      this.setLoading(false);
      return handlerError(e);
    }
  }

  async getUserPointHistory(
    clientId: string,
    userId: string,
  ): Promise<ErrorResponse | GetUserPointHistoryRespont[]> {
    try {
      this.setLoading(true);
      const response = await this.client.get(
        `/partner/${clientId}/user/${userId}/point-history`,
      );
      this.setLoading(false);
      return response.data.point_history;
    } catch (e) {
      this.setLoading(false);
      return handlerError(e);
    }
  }

  async getRedeemDetail(
    clientId: string,
    code: string,
  ): Promise<ErrorResponse | Redeem> {
    try {
      this.setLoading(true);
      const response = await this.client.get(
        `/partner/${clientId}/redeem/${code}`,
      );
      this.setLoading(false);
      return response.data.redeem;
    } catch (e) {
      this.setLoading(false);
      return handlerError(e);
    }
  }

  async redeemCode(
    clientId: string,
    code: string,
    userId: string,
  ): Promise<ErrorResponse | GetUserPointHistoryRespont> {
    try {
      this.setLoading(true);
      const response = await this.client.post(
        `/partner/${clientId}/redeem/${code}`,
        {
          line_user_id: userId,
        },
      );
      this.setLoading(false);
      return response.data.point;
    } catch (e) {
      this.setLoading(false);
      return handlerError(e);
    }
  }

  async listCoupon(clientId: string): Promise<ErrorResponse | Coupon[]> {
    try {
      this.setLoading(true);
      const response = await this.client.get(`/partner/${clientId}/coupon`);
      this.setLoading(false);
      return response.data.coupon;
    } catch (e) {
      this.setLoading(false);
      return handlerError(e);
    }
  }

  async getCouponDetailById(
    clientId: string,
    id: string,
  ): Promise<ErrorResponse | Coupon> {
    try {
      this.setLoading(true);
      const response = await this.client.get(
        `/partner/${clientId}/coupon/${id}`,
      );
      this.setLoading(false);
      return response.data.coupon;
    } catch (e) {
      this.setLoading(false);
      return handlerError(e);
    }
  }

  async redeemCoupon(
    clientId: string,
    couponId: number,
    userId: string,
  ): Promise<ErrorResponse | UserCoupon> {
    try {
      this.setLoading(true);
      const response = await this.client.post(
        `/partner/${clientId}/coupon/${couponId}/redeem`,
        {
          line_user_id: userId,
        },
      );
      this.setLoading(false);
      return response.data.coupon;
    } catch (e) {
      this.setLoading(false);
      return handlerError(e);
    }
  }

  async getUserCoupon(
    clientId: string,
    userId: string,
  ): Promise<ErrorResponse | UserCoupon[]> {
    try {
      this.setLoading(true);
      const response = await this.client.get(
        `/partner/${clientId}/user/${userId}/coupon`,
      );
      this.setLoading(false);
      return response.data.coupon;
    } catch (e) {
      this.setLoading(false);
      return handlerError(e);
    }
  }
}
