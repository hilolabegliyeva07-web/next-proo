import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/auth";

type User = {
    name: string,
    email: string,
    password: string
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (

            typeof email !== "string" || typeof password !== "string"

        ) {
            return NextResponse.json(
                { message: "Invalid user data" },
                { status: 400 }
            );
        }

        await connectDB();
        const foundUser = await User.findOne({
            email: email.trim().toLowerCase(),
        });

        if (!foundUser) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 400 }
            );
        }

        const verifyPassword = await bcrypt.compare(password, foundUser.password)

        if (!verifyPassword) {
            return NextResponse.json(
                { message: "Invalid password or email" },
                { status: 400 }
            );
        }

        const token = generateToken({
            email,
            userId: foundUser._id,
            role: foundUser.role
        })

        return NextResponse.json({
            message: "Login successful",
            token,
            user: foundUser
        }, { status: 200 });
    } catch (error) {
        console.error("Register failed:", error);
        return NextResponse.json(
            { message: "Failed to login" },
            { status: 500 }
        );
    }
}