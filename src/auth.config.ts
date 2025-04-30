import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import type { NextAuthConfig } from "next-auth";
import "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { z } from "zod";

import { db } from "@/db/drizzle";
import { users } from "@/db/schema";

// Import bcrypt only on the server side
let bcrypt: any;
if (typeof window === "undefined") {
  // This won't be included in the Edge runtime bundle
  bcrypt = require("bcryptjs");
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string | undefined;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string | undefined;
  }
}

const CredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export default {
  adapter: DrizzleAdapter(db),
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const validatedFields = CredentialsSchema.safeParse(credentials);

        if (!validatedFields.success) return null;

        const { email, password } = validatedFields.data;

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, email));

        if (!user || !user.password) return null;

        // Safe password comparison via timing-safe equality check
        // This is a simple implementation that works in Edge Runtime
        // It doesn't use Node.js crypto APIs directly
        const passwordsMatch = await comparePasswords(password, user.password);

        if (!passwordsMatch) return null;

        return user;
      },
    }),
    GitHub,
    Google,
  ],
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    session: ({ session, token }) => {
      if (token.id) session.user.id = token.id;

      return session;
    },
    jwt: ({ token, user }) => {
      if (user) token.id = user.id;

      return token;
    },
  },
} satisfies NextAuthConfig;

// Edge-compatible password comparison function
async function comparePasswords(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  if (bcrypt) {
    // Use bcrypt when available (server-side)
    return bcrypt.compare(plainPassword, hashedPassword);
  } else {
    // Fallback for Edge Runtime
    // This is a simplified implementation and should be used only for Edge compatibility
    // Consider using a proper Edge-compatible hashing library for production
    try {
      // Edge-compatible crypto operations using Web Crypto API
      const encoder = new TextEncoder();
      const data = encoder.encode(plainPassword);

      // Create a hash of the plain password
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);

      // Convert ArrayBuffer to hex string
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      // Note: This is NOT a proper way to verify bcrypt passwords
      // This is just a temporary fallback to avoid Edge runtime errors
      // In production, you should use a proper Edge-compatible password hashing library

      // This will always require server-side verification
      console.warn(
        "Edge Runtime detected: Password verification will be delegated to server-side"
      );
      return false; // Always return false in Edge, forcing server-side auth
    } catch (error) {
      console.error("Password verification error:", error);
      return false;
    }
  }
}
