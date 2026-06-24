import { Badge } from "@/components/ui/badge"
import { CourseCardProps } from "../types"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function CardImage({id, title, description, instructor, createdAt}: CourseCardProps) {
  return (
    <Card key={id} size="sm" className="relative mx-auto w-full max-w-sm pt-0 hover:scale-101 duration-100">
      <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
      <Image
        src={"/course-banner-mock.png"}
        alt="Course Banner Image"
        width={400}
        height={100}
        className="relative z-20 aspect-video w-full "
      />
      <CardHeader>
        <CardAction>
          <Badge variant="secondary">Publicado</Badge>
        </CardAction>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {description}...
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex-col pb-1">
        <Button className="w-full bg-amber-500 hover:bg-amber-400 text-black text-[1.2em] cursor-pointer">Acessar Curso</Button>
        <div className="bg-red-200 mt-2" >
            <p>{instructor.name} {new Date(createdAt).getDate()}/{String(new Date(createdAt).getMonth()+1)}/{new Date(createdAt).getFullYear()}</p>

        </div>
      </CardFooter>
    </Card>
  )
}
