import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";

connect();

export async function GET(request: NextRequest) {
    try {
        const userId = getDataFromToken(request);
        console.log("Extracted userId:", userId);

        const user = await User.findById(userId).select("-password");
        console.log("Found user:", user); // Add this line

        return NextResponse.json({
            message: "User found",
            data: user,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
