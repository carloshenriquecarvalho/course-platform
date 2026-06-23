'use client'
import LoginForm from "@/app/components/LoginForm";
import { useRouter } from "next/navigation";
import { useState } from "react"



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

        router.push("/dashboard");
    }

    return (
        <main className="flex items-center w-full h-screen justify-center bg-gray-100">
            <LoginForm
                email={email}
                password={password}
                onEmailChange={setEmail}
                onPasswordChange={setPassword}
                onSubmit={handleLogin}
            ></LoginForm>
        </main>
    )
    
}