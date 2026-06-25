import { LessonDetails } from "./LessonDetails";

export default async function LessonDetailsPage({params,}: {params: Promise<{ lessonId: string }>;}) {
    const {lessonId} = await params;
    return (
        <LessonDetails lessonId={lessonId} />
    )
}