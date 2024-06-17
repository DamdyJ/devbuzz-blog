import { z } from "zod";

export enum Tag {
    Javascript = "Javascript",
    Backend = "Backend",
    Frontend = "Frontend",
    CSS = "CSS",
    HTML = "HTML",
    SQL = "SQL",
    NOSQL = "NOSQL",
    DEFAULT = "",
}

export const ArticleSchema = z.object({
    title: z.string().max(50, {
        message: "Title must not be longer than 50 characters.",
    }),
    thumbnail: z.string(),
    tag: z.nativeEnum(Tag).default(Tag.DEFAULT),
    content: z.string().max(5000, {
        message: "Content must not be longer than 5000 characters.",
    }),
});

export type Article = z.infer<typeof ArticleSchema>;
