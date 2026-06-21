import {
  ErrorResponse,
  normalizePartnerAppConfig,
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
  UserCoupon,
  CouponType,
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
      const response = await this.client.get(`/partner/${clientId}`);

      return normalizePartnerAppConfig(response.data);
    } catch (e) {
      return handlerError(e);
    }
  }

  async getOrCreateUser(
    clientId: string,
    profile: Profile,
  ): Promise<ErrorResponse | User> {
    try {
      const response = await this.client.post(
        `/partner/${clientId}/user`,
        profile,
      );

      return response.data;
    } catch (e) {
      return handlerError(e);
    }
  }

  async submitPhone(
    clientId: string,
    payload: SubmitPhoneRequest,
  ): Promise<ErrorResponse | SubmitPhoneResponse> {
    try {
      const response = await this.client.post(
        `/partner/${clientId}/submit-phone`,
        payload,
      );

      return response.data;
    } catch (e) {
      return handlerError(e);
    }
  }

  async verifyPhone(
    clientId: string,
    payload: VerifyPhoneRequest,
  ): Promise<ErrorResponse | void> {
    try {
      const response = await this.client.post(
        `/partner/${clientId}/verify-phone`,
        payload,
      );

      return response.data;
    } catch (e) {
      return handlerError(e);
    }
  }

  async submitEmail(
    clientId: string,
    payload: SubmitEmailRequest,
  ): Promise<ErrorResponse | SubmitEmailResponse> {
    try {
      const response = await this.client.post(
        `/partner/${clientId}/submit-email`,
        payload,
      );

      return response.data;
    } catch (e) {
      return handlerError(e);
    }
  }

  async verifyEmail(
    clientId: string,
    payload: VerifyEmailRequest,
  ): Promise<ErrorResponse | void> {
    try {
      const response = await this.client.post(
        `/partner/${clientId}/verify-email`,
        payload,
      );

      return response.data;
    } catch (e) {
      return handlerError(e);
    }
  }

  async getUserPoint(
    clientId: string,
    userId: string,
  ): Promise<ErrorResponse | GetUserPointRespont[]> {
    try {
      const response = await this.client.get(
        `/partner/${clientId}/user/${userId}/point`,
      );

      return response.data.points;
    } catch (e) {
      return handlerError(e);
    }
  }

  async getUserPointHistory(
    clientId: string,
    userId: string,
  ): Promise<ErrorResponse | GetUserPointHistoryRespont[]> {
    try {
      const response = await this.client.get(
        `/partner/${clientId}/user/${userId}/point-history`,
      );

      return response.data.point_history;
    } catch (e) {
      return handlerError(e);
    }
  }

  async getRedeemDetail(
    clientId: string,
    code: string,
  ): Promise<ErrorResponse | Redeem> {
    try {
      const response = await this.client.get(
        `/partner/${clientId}/redeem/${code}`,
      );

      return response.data.redeem;
    } catch (e) {
      return handlerError(e);
    }
  }

  async redeemCode(
    clientId: string,
    code: string,
    userId: string,
  ): Promise<ErrorResponse | GetUserPointHistoryRespont> {
    try {
      const response = await this.client.post(
        `/partner/${clientId}/redeem/${code}`,
        {
          line_user_id: userId,
        },
      );

      return response.data.point;
    } catch (e) {
      return handlerError(e);
    }
  }

  async listCoupon(clientId: string): Promise<ErrorResponse | CouponType[]> {
    try {
      const response = await this.client.get(`/partner/${clientId}/coupon`);

      return response.data.coupon;
    } catch (e) {
      return handlerError(e);
    }
  }

  async getCouponDetailById(
    clientId: string,
    id: string,
  ): Promise<ErrorResponse | CouponType> {
    try {
      const response = await this.client.get(
        `/partner/${clientId}/coupon/${id}`,
      );

      return response.data.coupon;
    } catch (e) {
      return handlerError(e);
    }
  }

  async redeemCoupon(
    clientId: string,
    couponId: number,
    userId: string,
  ): Promise<ErrorResponse | UserCoupon> {
    try {
      const response = await this.client.post(
        `/partner/${clientId}/coupon/${couponId}/redeem`,
        {
          line_user_id: userId,
        },
      );

      return response.data.coupon;
    } catch (e) {
      return handlerError(e);
    }
  }

  async getUserCoupon(
    clientId: string,
    userId: string,
  ): Promise<ErrorResponse | UserCoupon[]> {
    try {
      const response = await this.client.get(
        `/partner/${clientId}/user/${userId}/coupon`,
      );

      return response.data.coupon;
    } catch (e) {
      return handlerError(e);
    }
  }

  async getUserCouponById(
    clientId: string,
    userId: string,
    couponId: string,
  ): Promise<ErrorResponse | UserCoupon> {
    try {
      const response = await this.client.get(
        `/partner/${clientId}/user/${userId}/coupon/${couponId}`,
      );

      return response.data.coupon;
    } catch (e) {
      return handlerError(e);
    }
  }

  async onUseCoupon(
    clientId: string,
    userId: string,
    couponCode: string,
  ): Promise<ErrorResponse | UserCoupon> {
    try {
      const response = await this.client.post(
        `/partner/${clientId}/user/${userId}/coupon/${couponCode}/use`,
      );

      return response.data.coupon;
    } catch (e) {
      return handlerError(e);
    }
  }

  async submitReceipt(
    clientId: string,
    userId: string,
    receiptNumber: string,
    receiptImage: string,
  ): Promise<ErrorResponse | void> {
    try {
      const response = await this.client.post(
        `/partner/${clientId}/user/${userId}/receipt`,
        {
          receipt_number: receiptNumber,
          receipt_image: receiptImage,
        },
      );

      return response.data;
    } catch (e) {
      return handlerError(e);
    }
  }
}
