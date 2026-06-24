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

export interface SearchCourseBarProps {
    onChange: (term: string) => void
}

export interface CoursePageProps {
    params: { id: string}
}