import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel.js";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { email, password } = reqBody;
        console.log(reqBody);

        // To check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({
                error: "The user does not exists",
                status: 400,
            });
        }

        // check if the passsword is correct
        const validPassword = await bcryptjs.compare(password, user.password);
        if (!validPassword) {
            return NextResponse.json(
                { error: "Invalid password, try again" },
                { status: 400 }
            );
        }

        // once all things are verified, generate and send a now
        const tokenData = {
            _id: user._id,
            username: user.username,
            email: user.email,
        };

        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET as string, {
            expiresIn: "1h",
        });

        const response = NextResponse.json({
            message: "login successful",
            success: true,
        });

        response.cookies.set("token", token, { httpOnly: true });

        return response;
    } catch (error: any) {
        return NextResponse.json({ error: error.message });
    }
}
