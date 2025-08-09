import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel.js";
import { sendEmail } from "@/helpers/mailer";

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { token } = reqBody;
        console.log(token);

        // This is finding a user based on token and whose expiry time is greater than now (gt)
        const user = await User.findOne({
            verifyToken: token,
            verifyTokenExpiry: { $gt: Date.now() },
        });

        if (!user) {
            return NextResponse.json(
                { error: "Invalid token" },
                { status: 400 }
            );
        }
        console.log(user);

        // This marks the user verified, and once it is done it flushes the token so that it can't be used anymore
        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;
        const savedUser = await user.save();
        console.log(savedUser);

        // await sendEmail({
        //     email: user.email,
        //     emailType: "VERIFY",
        //     userId: user._id,
        // });

        return NextResponse.json({
            Message: "Email verified successfully",
            success: true,
            savedUser,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
