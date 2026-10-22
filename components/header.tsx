"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { userStore } from "@/lib/store/user-store";
import { UserProfile } from "./user-avatar";

const Header = () => {
    const user = userStore((state) => state.user);
    const isInitialized = userStore((state) => state.isInitialized);

    return (
        <header className="w-full bg-gray-300 shadow-olive-900 flex justify-around py-4 items-center">
            <h1 className="font-bold text-xl text-blue-500">Appliances</h1>
            <div className="bg-white w-[413px] h-[44px] rounded-lg">
                <input className="w-full py-2 px-2" placeholder="Search here..." type="text" />
            </div>
            <div className="text-black flex gap-3 items-center min-w-[200px] justify-end">
                {!isInitialized ? (
                    <div className="size-10 animate-pulse rounded-full bg-gray-200" />
                ) : user ? (
                    <UserProfile />
                ) : (
                    <>
                        <Link href="/sign-in">
                            <Button variant="ghost" className="px-4 py-2">Log In</Button>
                        </Link>
                        <Link href="/sign-up">
                            <Button className="p-5 hover:scale-105 group">
                                Get Started{" "}
                                <ArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                            </Button>
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;