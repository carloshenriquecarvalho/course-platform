'use client'
import { useRouter } from "next/navigation";
import { useState } from "react"
import { CardSpacing } from "@/app/components/LoginForm";


export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter();

    async function handleLogin() {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email, 
                password
            })
        });
        const data = await response.json();

        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);

        router.push("/dashboard");
    }

    return (
        <main className="relative flex items-center w-full min-h-screen justify-center overflow-hidden bg-background px-4">
            {/* Decorative background orbs */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-5"
                style={{
                    background: "radial-gradient(circle, oklch(0.72 0.15 85) 0%, transparent 70%)",
                }}
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-60 -left-40 w-[500px] h-[500px] rounded-full opacity-4"
                style={{
                    background: "radial-gradient(circle, oklch(0.72 0.15 85) 0%, transparent 70%)",
                }}
            />

            {/* Subtle grid pattern overlay */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage:
                        "linear-gradient(oklch(1 0 0) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                }}
            />

            <CardSpacing
                email={email}
                password={password}
                onEmailChange={setEmail}
                onPasswordChange={setPassword}
                onSubmit={handleLogin}
            />
        </main>
    )
}