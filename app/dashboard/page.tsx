import { Suspense } from "react";
import CourseCardsGroup from "../components/dashboard/components/CourseCardsGroup";
import Header from "../components/dashboard/components/Header";
import Sidebar from "../components/dashboard/ui/Sidebar";

export default function Dashboard() {
    
    return (
        <div className="flex h-screen w-full overflow-hidden bg-background">
            {/* Sidebar — visible on md+ */}
            <div className="hidden md:flex">
                <Sidebar />
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
                    <div className="mb-8">
                        <h1 className="font-heading text-2xl font-semibold text-white">
                            Meus Cursos
                        </h1>
                        <p className="text-sm text-white/40 mt-1">
                            Continue de onde parou
                        </p>
                    </div>
                    <Suspense fallback={
                        <div className="flex items-center justify-center py-20">
                            <div className="w-6 h-6 rounded-full border-2 border-amber-400/30 border-t-amber-400 animate-spin" />
                        </div>
                    }>
                        <CourseCardsGroup />
                    </Suspense>
                </main>
            </div>
        </div>
    )
}