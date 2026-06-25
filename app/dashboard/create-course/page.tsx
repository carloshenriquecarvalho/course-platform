'use client'

import { Suspense, useState, useEffect } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import Sidebar from "@/app/components/dashboard/ui/Sidebar";
import Header from "@/app/components/dashboard/components/Header";
import CreateCourseForm from "@/app/components/dashboard/components/create-course/CreateCourseForm";

export default function CreateCoursePage() {
    useAuth();

    const [isMounted, setIsMounted] = useState(false);
    const [isUserAdmin, setIsUserAdmin] = useState(false);

    useEffect(() => {
        // Run after the initial paint to prevent cascading render warning
        setTimeout(() => {
            setIsMounted(true);
            const role = localStorage.getItem("role");
            setIsUserAdmin(role === "INSTRUCTOR" || role === "ADMIN");
        }, 0);
    }, []);

    if (!isMounted) return null;

    return (
        <div className="flex h-screen w-full overflow-hidden bg-background">
            {/* Sidebar */}
            <div className="hidden md:flex">
                <Sidebar isUserAdmin={isUserAdmin} />
            </div>

            {/* Main area */}
            <div className="flex flex-col flex-1 h-full overflow-hidden">
                <Suspense fallback={
                    <div className="h-16 w-full shrink-0 border-b border-white/5 bg-sidebar/80" />
                }>
                    <Header />
                </Suspense>

                <main className="flex-1 overflow-y-auto p-6 scrollbar-thin">
                    {/* Page heading */}
                    <div className="mb-8 max-w-2xl mx-auto">
                        <h1 className="font-heading text-2xl font-semibold text-white">
                            Novo Curso
                        </h1>
                        <p className="text-sm text-white/40 mt-1">
                            Preencha as informações do curso, módulos e aulas passo a passo.
                        </p>
                    </div>

                    <CreateCourseForm />
                </main>
            </div>
        </div>
    );
}
