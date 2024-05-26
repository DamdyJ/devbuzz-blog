"use client";
import React, { useEffect, useState } from "react";
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
import { useParams, useRouter } from "next/navigation";
import PageTransition from "@/components/page-transition";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { fetchGetArticle } from "@/api/get-single-article";
import DynamicBreadcrumbs, {
    BreadcrumbItemType,
} from "@/components/dynamic-breadcrumb";
import { Badge } from "@/components/ui/badge";
import fetchEditArticle from "@/api/edit-article";
import Link from "next/link";

export default function EditArticlePage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const [loading, setLoading] = useState(true);
    const tagValues: string[] = Object.values(Tag).filter(
        (value) => value !== Tag.DEFAULT
    );

    // State variables for the form fields
    const [username, setUsername] = useState("");
    const [title, setTitle] = useState("");
    const [tag, setTag] = useState("");
    const [thumbnail, setThumbnail] = useState("");
    const [content, setContent] = useState("");

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

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const articleResponse = await fetchGetArticle(params.id);
                const splitUrl = articleResponse.thumbnail.split("\\");
                const imageUrl = splitUrl[splitUrl.length - 1];
                setUsername(articleResponse.user);
                setTitle(articleResponse.title);
                setTag(articleResponse.tag);
                setThumbnail(imageUrl);
                setContent(articleResponse.content);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching article:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params.id]);

    if (loading) {
        return (
            <div>
                <h1>Loading...</h1>
            </div>
        );
    }

    const breadcrumbItems: BreadcrumbItemType[] = [
        { label: "Home", href: "/" },
        { label: "Articles", href: "/articles" },
    ];

    return (
        <>
            <PageTransition />
            <div className="flex flex-col p-4 gap-4 min-h-screen w-full max-w-7xl lg:flex-row lg:gap-8 mx-auto">
                {/* Preview */}
                <div className="flex-1 flex flex-col items-start gap-1 ">
                    <span className="text-gray-300 text-3xl font-bold mb-2 md:text-4xl lg:w-1/2">
                        Preview
                    </span>
                    <DynamicBreadcrumbs list={breadcrumbItems} />
                    <h1 className="font-bold text-2xl sm:text-4xl">{title}</h1>
                    <div className="flex items-center gap-3 py-2">
                        <span className="sm:text-lg font-semibold">
                            @{username}
                        </span>
                        <Badge>{tag}</Badge>
                    </div>
                    <AspectRatio ratio={16 / 9} className="bg-muted">
                        {thumbnail && (
                            <Image
                                className="object-cover rounded-sm"
                                src={
                                    thumbnail.startsWith("data:")
                                        ? thumbnail
                                        : `/thumbnail/${thumbnail}`
                                }
                                alt="thumbnail"
                                fill
                            />
                        )}
                    </AspectRatio>
                    <p className="text-base my-4">{content}</p>
                </div>
                {/* EDITOR */}
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
                                    <Button
                                        className="w-full"
                                        variant="outline"
                                    >
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
            </div>
        </>
    );
}
