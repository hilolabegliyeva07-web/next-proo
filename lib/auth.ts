import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import jwt from 'jsonwebtoken';

type User = {
    email: string,
    userId: string,
    role: 'user' | 'admin',
}

const JWT_SECRET = process.env.JWT_SECRET!


const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db()


export const auth = betterAuth({

    database: mongodbAdapter(db, {
        client
    }),
    emailAndPassword: {
        enabled: true
    },
});


export function generateToken(user: User) {
    const token = jwt.sign(
        user,
        JWT_SECRET, {
        expiresIn: '1d'
    }
    );
    return token;
}

export function verifyToken(token: string) {
    return jwt.verify(token, JWT_SECRET);
}