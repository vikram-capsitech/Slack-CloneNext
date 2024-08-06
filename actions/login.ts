"use server";
import * as z from "zod";

import { LoginSchema } from "@/schemas";
import { error } from "console";
import { db } from "@/lib/db";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/data/user";
import {
  generateTwoFactorToken,
  generateVerificationToken,
} from "@/lib/tokens";
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/lib/mail";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";

export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbacksUrl?: string | null
) => {
  const validate = LoginSchema.safeParse(values);
  if (!validate.success) {
    return { error: "Invalid fields" };
  }

  const { email, password, code } = validate.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password)
    return { error: "Email does not exist!" };

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return { success: "Confirmation email sent!" };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
      if (!twoFactorToken) return { error: "Invalid code!" };
      if (twoFactorToken.token !== code) return { error: "Invalid code!" };

      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if (hasExpired) return { error: "Code expired!" };

      await db.twoFactorToken.delete({
        where: { id: twoFactorToken.id },
      });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      );
      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id },
        });
      }

      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);

      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);

      return { twoFactor: true };
    }
  }
  var callback = callbacksUrl || DEFAULT_LOGIN_REDIRECT;
  if (existingUser) {
    const id = existingUser.id;

    console.log(id, "ahsdkjadjkahsdkjaskd");
    const organization = await db.server.findMany({
      where: {
        members: {
          some: {
            profileId: id,
          },
        },
      },
    });

    console.log("organization", organization);
    if (organization.length > 0) {
      callback = `/organization`;
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callback,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }
    throw error;
  }
};
