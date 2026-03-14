import type { Request, Response } from "express";

export function createStreamMessage(
    message: any,
    event?: "start" | "step" | "success" | "end" | "error",
): string {

    // No additional code needed here. The function constructs the SSE message correctly.
    // return `{data:${JSON.stringify(message)},event:${event ?? "step"} \n\n`;
    return `data: { message:${JSON.stringify(message)},event:${event ?? "step"}}\n\n`;
}

export async function createEventStream(req: Request, res: Response, streamFunction: AsyncGenerator) {

    req.on("close", () => {
        res.end();
    })

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    while (true) {

        await new Promise(resolve => setTimeout(resolve, 100));

        let value

        try {
            value = await streamFunction.next();
        } catch (error: any) {
            console.error("Error in event stream:", error);
            // res.write( JSON.stringify({status:"error",message:error.message}) + "\n\n");
            const message = createStreamMessage(error.message, "error");
            res.write(message);
            res.end();
            break;
        }
        if (value.done) {
            const message = createStreamMessage(value.value, "end");
            res.write(message);
            res.end();
            break;
        } else {
            const message = createStreamMessage(value.value, "step");
            res.write(message);
        }
    }
}