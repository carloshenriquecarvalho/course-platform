import { AppError } from "@/errors/app-error";
import { ZodError } from "zod";

export async function apiHandler(
    callback: () => Promise<Response>
): Promise<Response> {

    try {
        return await callback();

    } catch(error) {

        if(error instanceof AppError) {

            return Response.json(
                {
                    message: error.message
                },
                {
                    status: error.statusCode
                }
            );
        }

        if(error instanceof ZodError) {
            return Response.json(
                {
                    message: "Validation Error",
                    errors: error.flatten().fieldErrors
                },
                {
                    status: 400
                }
            )
        }

        console.error(error);

        return Response.json(
            {
                message: "Internal Error"
            },
            {
                status: 500
            }
        );
    }
}