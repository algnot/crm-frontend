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
    font_family: string;
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
    background_color: "#FFF8E7",
    button_color: "#FF8A00",
    font_family: "Geist, sans-serif",
    text_color: "#1F2937",
    button_text_color: "#FFFFFF",
    success_color: "#22C55E",
    error_color: "#EF4444",

    welcome_title: "ยินดีต้อนรับ",
    welcome_message: "พร้อมสั่งของอร่อยกันหรือยัง 🥕",

    contact_email: "support@bunzo.dev",
    contact_phone: "099-999-9999",

    crm_required_phone: true,
    crm_required_email: false,

    ui_custom_fields: [],
  },
});
