export interface UserRequestDTO {
    name: string,
    email: string,
    password: string,
}

export interface UserResponseDTO {
    id: string,
    name: string
}

export interface AttachmentRequest{
    filePath: string,
    lessonId: string,
    fileName: string,
    fileSize?: number
}

export interface LessonRequestDTO {
    id?: string,
    title: string,
    description?: string,
    videoPath?: string,
    duration?: number,
    order: number,
    moduleId: string
}


export interface LessonUpdateRequestDTO {
    id?: string,
    title?: string,
    description?: string,
    videoPath?: string,
    duration?: number,
    order?: number,
}