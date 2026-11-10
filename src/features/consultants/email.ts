/** Same canned message the mobile app opens in the mail client. */
export const EMAIL_SUBJECT = "Congratulations — Your Profile Has Been Shortlisted";

export const EMAIL_BODY = `Congratulations! 🎉

Your profile has been shortlisted by {{EmployerOrCoordinatorName}} for the {{JobOrProgramName}} position.

Our team or the employer will contact you soon with the next steps.

Please keep an eye on your inbox and dashboard for updates.

Wishing you the best of luck on your journey ahead!

Warm regards,
{Consultant R-US} Team`;

export const mailtoHref = (email?: string | null) =>
  email
    ? `mailto:${email}?subject=${encodeURIComponent(EMAIL_SUBJECT)}&body=${encodeURIComponent(EMAIL_BODY)}`
    : undefined;
