'use client'

import useFetchData from "@/app/hook/useFetchData";

interface Props {
  id: string;
}

export default function CourseDetails({ id }: Props) {
  const {
    data: course,
    loading,
    error,
  } = useFetchData({
    url: `/api/courses/${id}`,
  });

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p>Erro: {error}</p>;
  }

  if (!course) {
    return <p>Curso não encontrado.</p>;
  }

  return (
    <div>
      <h1>{course.title}</h1>
      <p>{course.description}</p>
    </div>
  );
}