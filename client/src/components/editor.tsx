"use client";
import React, { useState, useEffect } from "react";
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
import { ArticleSchema, Tag } from "@/utils/validations/article-validation";
import fetchEditArticle from "@/api/edit-article";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

interface EditorProps {
    title: string;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
    tag: string;
    setTag: React.Dispatch<React.SetStateAction<string>>;
    thumbnail: string;
    setThumbnail: React.Dispatch<React.SetStateAction<string>>;
    content: string;
    setContent: React.Dispatch<React.SetStateAction<string>>;
}

export default function Editor({
    title,
    setTitle,
    tag,
    setTag,
    thumbnail,
    setThumbnail,
    content,
    setContent,
}: EditorProps) {
    const router = useRouter();
    const params = useParams<{ id: string }>();
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
            const response = await fetchEditArticle(params.id, formData);
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
                setThumbnail(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setThumbnail("");
        }
    };

    return (
        <div className="flex-1">
            <span className="text-gray-300 text-3xl font-bold mb-2 md:text-4xl lg:w-1/2">
                Editor
            </span>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    method="POST"
                    encType="multipart/form-data"
                    className="flex flex-col gap-1 w-full mt-2 space-y-2 lg:gap-4"
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
                                    value={title}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        setTitle(e.target.value);
                                    }}
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
                                    onChange={(e) => {
                                        field.onChange(e);
                                        handleImageChange(e);
                                    }}
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
                                        setTag(value);
                                    }}
                                    value={tag}
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
                                    className="resize-none min-h-48 lg:min-h-96"
                                    value={content}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        setContent(e.target.value);
                                    }}
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex gap-4">
                        <Link
                            className="w-full"
                            href={`/articles/${params.id}`}
                            passHref
                        >
                            <Button className="w-full" variant="outline">
                                Cancel
                            </Button>
                        </Link>
                        <Button className="w-full " type="submit">
                            Save
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
