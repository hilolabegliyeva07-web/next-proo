"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, Mail, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { userStore } from "@/lib/store/user-store";
import { toast } from "sonner";

function getInitials(name: string) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "?";
    const first = parts[0][0] ?? "";
    const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
    return (first + last).toUpperCase();
}

function InitialsBadge({ name, size }: { name: string; size: "sm" | "lg" }) {
    const dimensions = size === "lg" ? "size-12 text-base" : "size-10 text-sm";
    return (
        <span
            className={`${dimensions} flex shrink-0 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-purple-500 font-semibold text-white shadow-sm ring-2 ring-white`}
        >
            {getInitials(name)}
        </span>
    );
}

export function UserProfile() {
    const user = userStore((state) => state.user);
    const logout = userStore((state) => state.logout);
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        function handleKey(e: KeyboardEvent) {
            if (e.key === "Escape") setOpen(false);
        }
        document.addEventListener("mousedown", handleClick);
        document.addEventListener("keydown", handleKey);
        return () => {
            document.removeEventListener("mousedown", handleClick);
            document.removeEventListener("keydown", handleKey);
        };
    }, []);

    if (!user) return null;

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={open}
                className="flex items-center gap-3 rounded-full bg-white/70 py-1 pl-1 pr-3 shadow-sm backdrop-blur transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
                <InitialsBadge name={user.name} size="sm" />
                <span className="hidden max-w-[140px] truncate text-sm font-semibold text-gray-900 sm:block">
                    {user.name}
                </span>
                <ChevronDown
                    className={`size-4 text-gray-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                />
            </button>

            {open && (
                <div
                    role="menu"
                    className="absolute right-0 z-50 mt-3 w-72 origin-top-right overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-150"
                >
                    <div className="flex items-center gap-3 bg-linear-to-br from-blue-50 to-purple-50 p-4">
                        <InitialsBadge name={user.name} size="lg" />
                        <div className="min-w-0">
                            <p className="truncate font-semibold text-gray-900">{user.name}</p>
                            <p className="flex items-center gap-1 truncate text-sm text-gray-500">
                                <Mail className="size-3.5 shrink-0" />
                                <span className="truncate">{user.email}</span>
                            </p>
                        </div>
                    </div>

                    <div className="p-2">
                        <Link
                            href="/products"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100"
                        >
                            <ShoppingBag className="size-4" /> Products
                        </Link>
                        <button
                            type="button"
                            onClick={() => {
                                logout();
                                setOpen(false);
                                toast.success("Logged out");
                            }}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 transition hover:bg-red-50"
                        >
                            <LogOut className="size-4" /> Log out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}