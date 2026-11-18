export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ForgotEmailFormData {
  email: string;
}

export interface OtpFormData {
  otp: string;
}

export interface ResetFormData {
  newPassword: string;
  confirmPassword: string;
}
