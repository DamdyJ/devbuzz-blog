"use client";
import React, { useState } from "react";
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
import fetchCreateArticle from "@/api/create-article";
import {
    ArticleSchema,
    Tag,
} from "@/utils/validations/create-article-validation";
import { useRouter } from "next/navigation";
import PageTransition from "@/components/page-transition";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
export default function CreateArticlePage() {
    const router = useRouter();
    const [preview, setPreview] = useState<string | null>(null);
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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    };

    return (
        <>
            <PageTransition />
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
                                    <FormLabel>
                                        Thumbnail
                                        <span className="ml-2 text-sm font-light text-black/50">
                                            (aspect ratio 16/9)
                                        </span>
                                    </FormLabel>
                                    <Input
                                        id="thumbnail"
                                        type="file"
                                        accept="image/*"
                                        placeholder="image"
                                        required
                                        onChange={(e) => {
                                            field.onChange(e);
                                            handleImageChange(e);
                                        }}
                                    />
                                    {preview && (
                                        <div className="mt-2">
                                            <AspectRatio
                                                ratio={16 / 9}
                                                className="bg-muted"
                                            >
                                                <Image
                                                    src={preview}
                                                    alt="Image Preview"
                                                    className="object-cover"
                                                    fill
                                                />
                                            </AspectRatio>
                                        </div>
                                    )}
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
                                                <SelectItem
                                                    key={tag}
                                                    value={tag}
                                                >
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
        </>
    );
}
