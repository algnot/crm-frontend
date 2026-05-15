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
    button_color: string;
    primary_color: string;
    secondary_color: string;
    text_color: string;
    button_text_color: string;
    success_color: string;
    error_color: string;

    welcome_title: string;
    welcome_message: string;

    contact_email: string;
    contact_phone: string;

    crm_required_phone: boolean;
    crm_required_email: boolean;

    ui_custom_fields: UiCustomField[];
  };
}

export interface UiCustomField {
  id?: number;
  name?: string;
  type?: string;
  required?: boolean;
  value?: string | number | boolean | null;
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
    button_color: "",
    text_color: "",
    primary_color: "",
    secondary_color: "",
    button_text_color: "",
    success_color: "",
    error_color: "",
    welcome_title: "ยินดีต้อนรับ",
    welcome_message: "",
    contact_email: "",
    contact_phone: "",
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
