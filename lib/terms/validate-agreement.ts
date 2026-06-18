export function validateTermsAgreement(
  body: unknown,
): { error: string; status: 400 } | null {
  if (
    typeof body !== 'object' ||
    body === null ||
    !('agreedToTerms' in body) ||
    (body as Record<string, unknown>).agreedToTerms !== true
  ) {
    return { error: 'You must agree to the submission terms before continuing.', status: 400 };
  }
  return null;
}
