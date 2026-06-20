import { AppError } from "@/errors/app-error";

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