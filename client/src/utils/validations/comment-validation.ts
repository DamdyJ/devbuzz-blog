import { z } from "zod";

export const CommentSchema = z.object({
    comment: z.string().max(50, {
        message: "Comment must not be longer than 50 characters.",
    }),
});
