"use client";

import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import fetchCreateArticle, { IArticle } from "@/api/create-article";
import { FormEvent } from "react";
import {
    ArticleSchema,
    Tag,
} from "@/utils/validations/create-article-validation";
import { useRouter } from "next/navigation";

export default function CreateArticlePage() {
    const router = useRouter();
    const tagValues: string[] = Object.values(Tag).filter(
        (value) => value !== Tag.DEFAULT
    );
    const form = useForm<z.infer<typeof ArticleSchema>>({
        resolver: zodResolver(ArticleSchema),
        defaultValues: {
            title: "",
            thumbnail: "",
            tag: Tag.DEFAULT,
            content: "",
        },
    });

    async function onSubmit(data: z.infer<typeof ArticleSchema>) {
        try {
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("tag", data.tag);
            formData.append("content", data.content);

            const fileInput = document.getElementById(
                "thumbnail"
            ) as HTMLInputElement;
            if (fileInput.files && fileInput.files[0]) {
                const file = fileInput.files[0];
                formData.append("thumbnail", file);
            }

            const response = await fetchCreateArticle(formData);
            toast({
                title: "Post successful",
            });
            router.push(`/articles/${response.article.id}`);
        } catch (error) {
            console.log(error);
            toast({
                title: "Post failed",
                description: "Please check your internet and try again.",
            });
        }
    }

    return (
        <div className="w-full min-h-screen flex gap-4 flex-col items-center justify-center">
            <h1 className="text-3xl font-bold md:text-4xl text-left lg:w-1/2">
                Create
            </h1>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    method="POST"
                    encType="multipart/form-data"
                    className="w-3/4 space-y-4 md:w-2/3 md:space-y-6 lg:w-1/2"
                >
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <Input
                                    type="text"
                                    placeholder="title"
                                    required
                                    {...field}
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="thumbnail"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Thumbnail</FormLabel>
                                <Input
                                    id="thumbnail"
                                    type="file"
                                    accept="image/*"
                                    placeholder="image"
                                    required
                                    {...field}
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="tag"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tag</FormLabel>
                                <Select
                                    onValueChange={(value) => {
                                        field.onChange(value);
                                    }}
                                    value={field.value || ""}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select tag" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {tagValues.map((tag) => (
                                            <SelectItem key={tag} value={tag}>
                                                {tag}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Content</FormLabel>
                                <Textarea
                                    placeholder="Share your thoughts and insights..."
                                    className="resize-none min-h-48"
                                    {...field}
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button className="w-full" type="submit">
                        Post
                    </Button>
                </form>
            </Form>
        </div>
    );
}
