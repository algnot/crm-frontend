export interface ErrorResponse {
  error: string;
  message: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isErrorResponse = (data: any): data is ErrorResponse => {
  return typeof data.error === "string" && typeof data.message === "string";
};

export interface PartnerAppConfig {
  id: number;
  name: string;
  slug: string;
  description: string;
  active: boolean;
  logo_url: string;

  line: {
    liff_id: string;
  };

  ui: {
    background_color: string;
    background_white_color: string;
    primary_color: string;
    secondary_color: string;

    text_color: string;
    text_white_color: string;
    text_gray_color: string;
    text_success_color: string;
    text_error_color: string;

    button_color: string;
    button_text_color: string;

    welcome_title: string;

    crm_required_phone: boolean;
    crm_required_email: boolean;

    ui_custom_fields: UiCustomField[];
  };
}

export interface UiCustomField {
  key: string;
  value: string;
}

export const initPartnerAppConfig = (): PartnerAppConfig => ({
  id: 0,
  name: "",
  slug: "",
  description: "",
  active: false,
  logo_url: "",

  line: {
    liff_id: "",
  },

  ui: {
    background_color: "",
    background_white_color: "",
    primary_color: "",
    secondary_color: "",

    text_color: "",
    text_white_color: "",
    text_gray_color: "",
    text_success_color: "",
    text_error_color: "",

    button_color: "",
    button_text_color: "",

    welcome_title: "ยินดีต้อนรับ",

    crm_required_phone: true,
    crm_required_email: false,

    ui_custom_fields: [],
  },
});

export interface User {
  id: number;
  display_name: string;
  picture_url: string;
  line_user_id: string;
  birth_date: string;
  gender: string;
  email: string;
  phone: string;
  force_verify_phone: boolean;
  force_verify_email: boolean;
}

export interface SubmitPhoneRequest {
  userId: string;
  phone: string;
}

export interface SubmitPhoneResponse {
  ref: string;
}

export interface VerifyPhoneRequest {
  ref: string;
  otp: string;
}

export interface SubmitEmailRequest {
  userId: string;
  email: string;
}

export interface SubmitEmailResponse {
  ref: string;
}

export interface VerifyEmailRequest {
  ref: string;
  otp: string;
}

export interface Currency {
  id: number;
  name: string;
  is_default: boolean;
}

export interface GetUserPointRespont {
  currency: Currency;
  earn: number;
  transfer: number;
  burn: number;
  balance: number;
}

export interface GetUserPointHistoryRespont {
  id: number;
  name: string;
  value: number;
  type: "earn" | "burn" | "tranfer";
  given_date: string;
  expiration_date: string;
  currency: Currency;
}

export interface Redeem {
  code: string;
  name: string;
  value: number;
  type: "earn" | "burn" | "tranfer";
  limit_per_user: number;
  limit_per_qr: number;
  redeemed_count: number;
  expiration_date: number;
  active: boolean;
  currency: Currency;
}

export interface Coupon {
  id: number;
  name: string;
  image_url: string;
  value: number;
  start_time: string;
  end_time: string;
  code_expiry_interval: number;
  redeemed_count: number;
  term_and_condition: string;
  currency: Currency;
}
