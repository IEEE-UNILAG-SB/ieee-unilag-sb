export const SEED_WIPE_FLAG = "--i-know-this-wipes-events";

export function seedAllowed(
  env: NodeJS.ProcessEnv = process.env,
  argv: string[] = process.argv,
): boolean {
  if (env.NODE_ENV === "production" && !argv.includes(SEED_WIPE_FLAG)) {
    return false;
  }
  return true;
}
