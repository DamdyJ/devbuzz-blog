import { z } from "zod";

export const SignUpSchema = z.object({
    username: z
        .string()
        .min(3, {
            message: "Username must be at least 3 characters.",
        })
        .max(50, {
            message: "Username must be at less than 50 characters.",
        }),
    email: z.string().email({
        message: "Please enter a valid email",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
});
