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
        const { name, email, password } = body;
        await connectDB();

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({
            email: normalizedEmail,
        });
        if (existingUser) {
            return NextResponse.json(
                { message: "This email is already registered" },
                { status: 400 }
            );
        }

        if (
            typeof name !== "string" ||
            !name.trim() ||
            typeof email !== "string" || typeof password !== "string"

        ) {
            return NextResponse.json(
                { message: "Invalid user data" },
                { status: 400 }
            );
        }

        await connectDB();

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            name,
            email, password: hashedPassword, role: "user"
        });

        const token = generateToken({
            userId: user._id,
            email: email,
            role: "user"
        })

        return NextResponse.json({
            message: "Register successful",
            token,
            user,
        }, { status: 201 });
    } catch (error) {
        console.error("Register failed:", error);
        return NextResponse.json(
            { message: "Failed to create user" },
            { status: 500 }
        );
    }
}