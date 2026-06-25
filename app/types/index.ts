export interface LoginFormProps {
    email: string,
    password: string,

    onEmailChange: (value: string) => void;
    onPasswordChange: (value: string) => void;

    onSubmit: () => void;
}

export interface CourseCardProps{
    id: string,
    title: string,
    description: string,
    instructor: {id: string, name: string},
    createdAt: Date
}

export interface Lesson {
    id: string,
		title: string,
		description: string,
		videoPath: string
		duration: number,
		order: number,
        module: Modules,
		moduleId: number
		createdAt: Date
		updatedAt: Date
}

export interface Modules {
    id: string,
    title: string,
    order: number,
    lessons: Lesson[],
    courseId: string,
    course: Course
}

export interface Course {
    id: string,
    title: string,
    description: string,
    instructor: {id: string, name: string},
    createdAt: Date,
    modules: Modules[]
}

export interface SearchCourseBarProps {
    onChange: (term: string) => void
}

export interface CoursePageProps {
    params: { id: string}
}