import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: process.env.GMAIL_SERVICE,
  host: process.env.GMAIL_HOST,
  port: 587,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const domain = process.env.NEXT_PUBLIC_APP_URL;
export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Your Two-Factor Authentication Code",
    html: `
                <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Two-Factor Authentication</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; background-color: #ffffff;">
                <tr>
                    <td align="center" bgcolor="#ffffff" style="padding: 40px 0 30px 0; color: #333333; font-size: 28px; font-weight: bold;">
                        <img src="https://www.capsitech.com/wp-content/themes/capsitech/assets/images/capLogo.svg" alt="Scraawl Logo" width="180" height="80">
                        <div>🔐 Two-Factor Authentication</div>
                    </td>
                </tr>
                <tr>
                    <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                                <td style="color: #333333; font-size: 24px; font-weight: bold; padding-bottom: 20px;">
                                    Verify Your Identity
                                </td>
                            </tr>
                            <tr>
                                <td style="color: #333333; font-size: 16px; line-height: 24px; padding-bottom: 20px;">
                                    Hi Dear,
                                </td>
                            </tr>
                            <tr>
                                <td style="color: #333333; font-size: 16px; line-height: 24px; padding-bottom: 20px;">
                                    To complete your sign-in, please use the following code to verify your identity:
                                </td>
                            </tr>
                            <tr>
                                <td align="center" style="padding: 20px 0;">
                                    <div style="background-color: #f4f4f4; color: #333333; padding: 12px 24px; border-radius: 5px; font-size: 20px; font-weight: bold;">
                                        ${token}
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td align="center" style="padding: 20px 0;">
                                    <button onclick="navigator.clipboard.writeText('${token}')" style="background-color: #4CAF50; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 16px; cursor: pointer;">📋 Copy Code</button>
                                </td>
                            </tr>
                            <tr>
                                <td style="color: #333333; font-size: 16px; line-height: 24px; padding-bottom: 20px;">
                                    <p>If you did not request this verification, please ignore this email. Your account security remains intact.</p>
                                </td>
                            </tr>
                            <tr>
                                <td style="color: #333333; font-size: 16px; line-height: 24px; padding-bottom: 20px;">
                                    Best regards,<br>
                                    The Scraawl Team
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td bgcolor="#f4f4f4" style="padding: 30px 30px 30px 30px; text-align: center; color: #888888; font-size: 14px;">
                        &copy; 2024 Scraawl. All rights reserved.
                    </td>
                </tr>
            </table>
        </body>
        </html>
        `,
  });
};

// export const sendPasswordResetEmail = async (email: string, token: string) => {
//   const resetLink = `${domain}/auth/new-password?token=${token}`;
//   console.log("this is test email", email);
//   await resend.emails.send({
//     from: "onboarding@resend.dev",
//     to: email,
//     subject: "Reset your password!",
//     html: `
//         <!DOCTYPE html>
//         <html lang="en">
//         <head>
//             <meta charset="UTF-8">
//             <meta name="viewport" content="width=device-width, initial-scale=1.0">
//             <title>Password Reset</title>
//         </head>
//         <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #121481;">
//             <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse;">
//                 <tr>
//                     <td align="center" bgcolor="#121481" style="padding: 40px 0 30px 0; color: #ffffff; font-size: 28px; font-weight: bold;">
//                         Password Reset Request
//                     </td>
//                 </tr>
//                 <tr>
//                     <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
//                         <table border="0" cellpadding="0" cellspacing="0" width="100%">
//                             <tr>
//                                 <td style="color: #333333; font-size: 24px; font-weight: bold; padding-bottom: 20px;">
//                                     Password Reset
//                                 </td>
//                             </tr>
//                             <tr>
//                                 <td style="color: #333333; font-size: 16px; line-height: 24px; padding-bottom: 20px;">
//                                     Hi Dear,
//                                 </td>
//                             </tr>
//                             <tr>
//                                 <td style="color: #333333; font-size: 16px; line-height: 24px; padding-bottom: 20px;">
//                                     We received a request to reset your password. Click the button below to reset your password.
//                                 </td>
//                             </tr>
//                             <tr>
//                                 <td align="center" style="padding: 20px 0;">
//                                     <a href="${resetLink}" style="background-color: #121481; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 16px;">Reset Password</a>
//                                 </td>
//                             </tr>
//                             <tr>
//                                 <td style="color: #333333; font-size: 16px; line-height: 24px; padding-bottom: 20px;">
//                                     <p>If you did not request a password reset, please ignore this email. Your password will remain unchanged.</p>
//                                 </td>
//                             </tr>
//                             <tr>
//                                 <td style="color: #333333; font-size: 16px; line-height: 24px; padding-bottom: 20px;">
//                                     Best regards,<br>
//                                     The Scraawl Team
//                                 </td>
//                             </tr>
//                         </table>
//                     </td>
//                 </tr>
//                 <tr>
//                     <td bgcolor="#f4f4f4" style="padding: 30px 30px 30px 30px; text-align: center; color: #888888; font-size: 14px;">
//                         &copy; 2024 Scraawl. All rights reserved.
//                     </td>
//                 </tr>
//             </table>
//         </body>
//         </html>
//         `,
//   });
// };

export const sendVerificationEmail = async (
  email: string,
  token: string,
  name?: string
) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;

  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Confirm your email!",
    html: `
       <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Confirmation</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; background-color: #ffffff;">
                <tr>
                    <td align="center" bgcolor="#ffffff" style="padding: 40px 0 30px 0; color: #333333; font-size: 28px; font-weight: bold;">
                        <img src="https://www.capsitech.com/wp-content/themes/capsitech/assets/images/capLogo.svg" alt="Scraawl Logo" width="180" height="80">
                        <div>🎉 Welcome to Scraawl!</div>
                    </td>
                </tr>
                <tr>
                    <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                                <td style="color: #333333; font-size: 24px; font-weight: bold; padding-bottom: 20px;">
                                    Email Confirmation
                                </td>
                            </tr>
                            <tr>
                                <td style="color: #333333; font-size: 16px; line-height: 24px; padding-bottom: 20px;">
                                    Hi ${name ?? "Dear"},
                                </td>
                            </tr>
                            <tr>
                                <td style="color: #333333; font-size: 16px; line-height: 24px; padding-bottom: 20px;">
                                    Thank you for signing up for Scraawl. Please confirm your email address by clicking the button below.
                                </td>
                            </tr>
                            <tr>
                                <td align="center" style="padding: 20px 0;">
                                    <a href="${confirmLink}" style="background-color: #4CAF50; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 16px;">✅ Confirm Email</a>
                                </td>
                            </tr>
                            <tr>
                                <td style="color: #333333; font-size: 16px; line-height: 24px; padding-bottom: 20px;">
                                    <p>Scraawl is designed to make office life easy and sorted. With features like real-time messaging, task management, and seamless integration with other tools, Scraawl helps you stay organized and productive.</p>
                                    <p>If you have any questions, feel free to contact our support team.</p>
                                </td>
                            </tr>
                            <tr>
                                <td style="color: #333333; font-size: 16px; line-height: 24px; padding-bottom: 20px;">
                                    Best regards,<br>
                                    The Scraawl Team
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td bgcolor="#f4f4f4" style="padding: 30px 30px 30px 30px; text-align: center; color: #888888; font-size: 14px;">
                        &copy; 2024 Scraawl. All rights reserved.
                    </td>
                </tr>
            </table>
        </body>
        </html>
        `,
  });
};

export const sendPasswordResetEmail = async (
  email: string,
  token: string
): Promise<void> => {
  const resetLink = `${domain}/auth/new-password?token=${token}`;

  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Reset your password!",
    html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; background-color: #ffffff;">
                <tr>
                    <td align="center" bgcolor="#ffffff" style="padding: 40px 0 30px 0; color: #333333; font-size: 28px; font-weight: bold;">
                        <img src="https://www.capsitech.com/wp-content/themes/capsitech/assets/images/capLogo.svg" alt="Scraawl Logo" width="180" height="80">
                        <div>🔒 Password Reset Request</div>
                    </td>
                </tr>
                <tr>
                    <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                                <td style="color: #333333; font-size: 24px; font-weight: bold; padding-bottom: 20px;">
                                    Password Reset
                                </td>
                            </tr>
                            <tr>
                                <td style="color: #333333; font-size: 16px; line-height: 24px; padding-bottom: 20px;">
                                    Hi Dear,
                                </td>
                            </tr>
                            <tr>
                                <td style="color: #333333; font-size: 16px; line-height: 24px; padding-bottom: 20px;">
                                    We received a request to reset your password. Click the button below to reset your password.
                                </td>
                            </tr>
                            <tr>
                                <td align="center" style="padding: 20px 0;">
                                    <a href="${resetLink}" style="background-color: #4CAF50; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 16px;">🔑 Reset Password</a>
                                </td>
                            </tr>
                            <tr>
                                <td style="color: #333333; font-size: 16px; line-height: 24px; padding-bottom: 20px;">
                                    <p>If you did not request a password reset, please ignore this email. Your password will remain unchanged.</p>
                                </td>
                            </tr>
                            <tr>
                                <td style="color: #333333; font-size: 16px; line-height: 24px; padding-bottom: 20px;">
                                    Best regards,<br>
                                    The Scraawl Team
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td bgcolor="#f4f4f4" style="padding: 30px 30px 30px 30px; text-align: center; color: #888888; font-size: 14px;">
                        &copy; 2024 Scraawl. All rights reserved.
                    </td>
                </tr>
            </table>
        </body>
        </html>
        `,
  });
};
