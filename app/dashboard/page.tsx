'use client'
import CourseCardsGroup from "../components/dashboard/components/CourseCardsGroup";
import Header from "../components/dashboard/components/Header";

export default function Dashboard() {
    return (
        <>  
        <div className="flex h-screen w-full overflow-hidden">
            <aside className="w-64 h-full shrink-0 border-r ">
            </aside>

            <div className="flex flex-col flex-1 h-full overflow-hidden">
                <Header></Header>
                <main className="flex-1 overflow-y-auto p-6 ">
                <CourseCardsGroup />
                </main>
            </div>
            </div>
        
        </>
    )
}