export const env = {
  apiUrl: (process.env.NEXT_PUBLIC_API_URL ?? "https://api.staging.consultantsrus.co").replace(
    /\/+$/,
    "",
  ),
};
