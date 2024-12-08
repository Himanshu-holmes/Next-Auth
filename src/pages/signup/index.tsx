"use client"

import { useRouter } from "next/router";
import { useState } from "react";

// sign up page


export default function page() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const router = useRouter();


    return (
        <div className="flex flex-col items-center justify-center gap-4">
        <h1>Sign Up</h1>
        <form className="flex flex-col text-black"
            onSubmit={async (e) => {
            e.preventDefault();
            try {
                const response = await fetch("/api/sign-up", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
                });
                if (!response.ok) {
                throw new Error("Failed to sign up");
                }
                router.push("/");
            } catch (error:any) {
                setError(error.message);
            }
            }}
        >
            <input className="my-2"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />
            <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
            <button className="bg-blue-500 mt-3 p-2 rounded-md" type="submit">Sign Up</button>
        </form>
        </div>
    );
}
