"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "next/navigation";
import fetchGetComments from "@/api/get-comment";
import { FormProvider, useForm } from "react-hook-form";
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { CommentSchema } from "@/utils/validations/comment-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import fetchCreateComment from "@/api/create-comment";
import fetchGetUsername from "@/api/get-username";
interface Comment {
    username: string;
    comment: string;
}
export default function CommentPage() {
    const params = useParams<{ id: string }>();
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState<Comment[]>([]);

    const form = useForm<z.infer<typeof CommentSchema>>({
        resolver: zodResolver(CommentSchema),
        defaultValues: {
            comment: "",
        },
    });

    async function onSubmit(data: z.infer<typeof CommentSchema>) {
        try {
            const formData = new FormData();
            formData.append("comment", data.comment);
            const comment = await fetchCreateComment(
                params.id,
                formData.get("comment")
            );
            console.log(comment);
            const username = await fetchGetUsername(comment.user_id);
            toast({
                title: "Comment successful",
            });
            setComments([
                ...comments,
                { username: username.username, comment: data.comment },
            ]);
        } catch (error) {
            toast({
                title: "Comment failed",
                description: "Please check your credentials and try again.",
            });
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const commentResponse = await fetchGetComments(params.id);
                const formattedComments = commentResponse
                    .map((comment) => ({
                        id: comment.id,
                        username: comment.user_id,
                        comment: comment.comment,
                        createdAt: new Date(comment.created_at),
                    }))
                    .sort((a: any, b: any) => a.createdAt - b.createdAt);
                setComments(formattedComments);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching comments:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params.id]);

    return (
        <>
            <FormProvider {...form}>
                <form
                    method="POST"
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full"
                >
                    <FormField
                        control={form.control}
                        name="comment"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex gap-3 pt-2 pb-4 sm:pt-3 sm:pb-5">
                                    <Avatar>
                                        <AvatarImage
                                            src="https://github.com/shadcn.png"
                                            alt="@shadcn"
                                        />
                                        <AvatarFallback>profile</AvatarFallback>
                                    </Avatar>
                                    <div className="w-full grid gap-2 sm:w-2/3 sm:gap-4">
                                        <Textarea
                                            id="comment"
                                            className="w-full resize-none"
                                            placeholder="Add a comment..."
                                            {...field}
                                        />
                                        <Button type="submit">Submit</Button>
                                    </div>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </form>
            </FormProvider>
            {comments.length > 0 ? (
                <div className="grid gap-4 w-full md:w-2/3 lg:w-1/2">
                    {comments.map((comment, index) => (
                        <div key={index} className="flex gap-3 items-start">
                            <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>
                                    {comment.username}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid gap-1">
                                <span className="text-sm font-semibold">
                                    @{comment.username}
                                </span>
                                <div role="text" dir="auto">
                                    {comment.comment}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                ""
            )}
        </>
    );
}
