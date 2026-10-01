const ADMIN_EMAILS = [
  'gitongab210@gmail.com',
  'stephennjora3@gmail.com',
  'njorastephen1@gmail.com'
];

export function isAdmin(email: string | undefined | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}
