"use server";

import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";
import { db } from "@/lib/db";

export const newVerification = async (token: string) => {
  try {
    // Retrieve the token from the database
    const existingToken = await getVerificationTokenByToken(token);

    if (!existingToken) {
      return { error: "Token does not exist!" };
    }

    // Check if the token has expired
    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
      return { error: "Token has expired!" };
    }

    // Retrieve the user associated with the email
    const existingUser = await getUserByEmail(existingToken.email);

    if (!existingUser) {
      return { error: "Email does not exist!" };
    }

    // Update the user's email verification status
    await db.user.update({
      where: { id: existingUser.id },
      data: {
        emailVerified: new Date(),
        email: existingToken.email,
      },
    });

    // Delete the verification token after successful verification
    await db.verificationToken.delete({ where: { id: existingToken.id } });

    // Return a success message
    return { success: "Email verification successful!" };
  } catch (err) {
    console.error("Error during verification:", err);
    return { error: "An error occurred during verification." };
  }
};
