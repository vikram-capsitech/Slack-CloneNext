import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import jwt from "jsonwebtoken";

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET
    }),
    Credentials({
      async authorize(credentials) {
        const validate = LoginSchema.safeParse(credentials);
        if (validate.success) {
          const { email, password } = validate.data;

          const user = await getUserByEmail(email);
          if (!user || !user.password) return null;

          const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET!,
            { expiresIn: "1d" }
          );

          const passwordMatch = await bcrypt.compare(password, user.password);
          if (passwordMatch) return { ...user, accessToken: token };
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
