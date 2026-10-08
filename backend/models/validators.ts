// Route-layer express-validator isEmail() is the primary email validator.
// This pattern is last-line defence at the Mongoose schema level only,
// intentionally permissive so it never rejects what the route accepts
// (plus-addressing, long TLDs, subdomains).
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
