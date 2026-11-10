export const ENDPOINTS = {
  auth: {
    checkEmail: "/auth/check-email",
    signUp: "/auth/user-signup",
    login: "/auth/login",
    logout: "/auth/logout",
    forgotPassword: "/auth/forgot-password",
    verifyResetOtp: "/auth/verify-reset-otp",
    resetPassword: "/auth/reset-password",
    changePassword: "/auth/change-password",
    deleteAccount: "/auth/delete-account",
  },
  company: {
    completeProfile: "/contractor/complete-profile",
    updateProfile: "/contractor/update-profile",
    getProfile: "/contractor/get-profile",
    allCompanies: "/contractor/get-all-companies",
  },
  consultants: {
    list: "/contractor/get-employees-by-contractor",
    trackEvent: "/contractor/track-employee-event",
    sendEmail: "/contractor/send-email-to-employee",
  },
  favorites: {
    toggle: "/contractor/add-wishlist",
    list: "/contractor/get-wishlist",
  },
} as const;
