export enum MailTemplates {
  volunteer_interest = "volunteer_interest",
  forgotPassword = "forgotPassword",
  passwordResetCompleted = "passwordResetCompleted",
}

export interface MailOptions {
  to: string;
  from?: string;
  subject?: string;
  body?: string;
  templateName?: MailTemplates;
  replacements?: object;
}

export interface ResetPasswordData {
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
}
