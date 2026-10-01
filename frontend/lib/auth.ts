// NODE RUNTIME ONLY — never import this module (or lib/mongo.ts) from
// proxy.ts, middleware, or any Edge runtime route. The mongodb driver is a
// Node.js native module and cannot load in Edge/Deno runtimes (breaks
// Netlify Edge bundling). Route protection must use an edge-safe check
// (e.g. getSessionCookie) with per-page server verification instead.
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { getDb, getMongoClient } from "./mongo";

const googleClientId = process.env.GOOGLE_CLIENT_ID ?? "";
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET ?? "";
const googleConfigured =
  googleClientId.length > 0 && googleClientSecret.length > 0;

const db = getDb();
const mongoClient = getMongoClient();

export const auth = betterAuth({
  baseURL:
    process.env.BETTER_AUTH_URL ??
    process.env.NEXT_PUBLIC_BASE_URL ??
    "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [
    "http://localhost:3000",
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://ieee-unilag-sb.vercel.app",
  ],
  ...(db && mongoClient
    ? {
        // transaction:false — local standalone mongod has no replica set;
        // single-doc auth writes stay correct without multi-doc atomicity.
        database: mongodbAdapter(db, { client: mongoClient, transaction: false }),
      }
    : {}),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 10,
    maxPasswordLength: 128,
    requireEmailVerification: false,
  },
  socialProviders: googleConfigured
    ? {
        google: {
          clientId: googleClientId,
          clientSecret: googleClientSecret,
        },
      }
    : {},
  session: {
    expiresIn: 60 * 60 * 24,
    updateAge: 60 * 60,
    freshAge: 60 * 15,
  },
  rateLimit: {
    enabled: true,
    window: 60,
    max: 100,
    storage: db ? "database" : "memory",
    customRules: {
      "/sign-in/email": { window: 10, max: 3 },
    },
  },
  plugins: [nextCookies()],
});

export const isGoogleConfigured = googleConfigured;
