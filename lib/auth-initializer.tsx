
"use client";

import { useEffect } from "react";
import { userStore } from "./store/user-store";


export default function AuthInitializer() {
    const fetchUser = userStore((state) => state.fetchUser);

    useEffect(() => {
        void fetchUser();
    }, [fetchUser]);

    return null;
}
