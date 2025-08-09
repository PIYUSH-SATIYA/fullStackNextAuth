// The mailer to send emails like verifying user, forgot password etc.
// In some cases like forgot password or verifying, we need to generate token and verify them and set them up. Usually token related tasks are done in separate file and the mailer is kept just for mailing purpose, but for simplicity everything is done here

import nodemailer from "nodemailer";
import User from "@/models/userModel.js";
import bcryptjs from "bcryptjs";

export const sendEmail = async ({ email, emailType, userId }: any) => {
    try {
        // create a hashed token
        const hashedToken = await bcryptjs.hash(userId.toString(), 10);

        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId, {
                verifyToken: hashedToken,
                verifyTokenExpiry: Date.now() + 3600000, // Fix: was verifyTokneExpiry
            });
        } else if (emailType === "RESET") {
            await User.findByIdAndUpdate(userId, {
                forgotPasswordToken: hashedToken,
                forgotPasswordTokenExpiry: Date.now() + 3600000,
            });
        }

        // Looking to send emails in production? Check out our Email API/SMTP product!
        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "14845938038ea2",
                pass: "2746f1dba2cc22",
            },
        });

        const mailOptions = {
            from: "piyushsatiya657@gmail.com",
            to: email,
            subject:
                emailType === "VERIFY"
                    ? "verify your email"
                    : "Reset your password",
            html: `<p>Click <a href="${process.env.domain}/${
                emailType === "VERIFY" ? "verifyemail" : "forgotpassword"
            }?token=${hashedToken}"> here </a> to ${
                emailType === "VERIFY"
                    ? "verify your email"
                    : "reset your password"
            }
            or copy paste this link in browser, <br> ${process.env.domain}/${
                emailType === "VERIFY" ? "verifyemail" : "forgotpassword"
            }?token=${hashedToken}
            </p>`,
        };

        const mailresponse = await transport.sendMail(mailOptions);
        return mailresponse;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
