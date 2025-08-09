import { connect } from "@/dbConfig/dbConfig";
import { sendEmail } from "@/helpers/mailer";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { email, token, password } = reqBody;

        // Case 1: Reset password with token
        if (token && password) {
            const user = await User.findOne({
                forgotPasswordToken: token,
                forgotPasswordTokenExpiry: { $gt: Date.now() },
            });

            if (!user) {
                return NextResponse.json(
                    { error: "Invalid or expired token" },
                    { status: 400 }
                );
            }

            // Hash the new password
            const salt = await bcryptjs.genSalt(10);
            const hashedPassword = await bcryptjs.hash(password, salt);

            console.log("new password hashed");

            user.password = hashedPassword;
            user.forgotPasswordToken = undefined;
            user.forgotPasswordTokenExpiry = undefined;

            await user.save();

            console.log("saved the new user");

            return NextResponse.json({
                message: "Password reset successfully",
                success: true,
            });
        }

        // Case 2: Send reset email
        if (email) {
            const user = await User.findOne({ email: email });

            if (!user) {
                return NextResponse.json(
                    { error: "User not found" },
                    { status: 400 }
                );
            }

            // Always send reset email (generate new token)
            await sendEmail({ email, emailType: "RESET", userId: user._id });

            return NextResponse.json({
                message: "Password reset email sent successfully",
                success: true,
            });
        }

        // If neither condition is met
        return NextResponse.json(
            { error: "Email or token with password required" },
            { status: 400 }
        );
    } catch (error: any) {
        console.log("Error from forgotpassword:", error.message);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
