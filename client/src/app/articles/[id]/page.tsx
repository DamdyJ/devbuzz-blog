"use client";

import { fetchGetArticle } from "@/api/get-single-article";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import Comment from "@/components/comment";
import DynamicBreadcrumbs, {
    BreadcrumbItemType,
} from "@/components/dynamic-breadcrumb";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
export default function ArticlePage() {
    const params = useParams<{ id: string }>();
    const [loading, setLoading] = useState(true);
    const [article, setArticle] = useState({
        username: "",
        title: "",
        tag: "",
        thumbnail: "",
        content: "",
    });

    const breadcrumbItems: BreadcrumbItemType[] = [
        { label: "Home", href: "/" },
        { label: "Articles", href: "/articles" },
    ];

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const articleResponse = await fetchGetArticle(params.id);
                const splitUrl = articleResponse.thumbnail.split("\\");
                const imageUrl = splitUrl[splitUrl.length - 1];
                setArticle({
                    username: articleResponse.user,
                    title: articleResponse.title,
                    tag: articleResponse.tag,
                    thumbnail: imageUrl,
                    content: articleResponse.content,
                });

                setLoading(false);
            } catch (error) {
                console.error("Error fetching new access token:", error);
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

    return (
        <>
            <div className="w-full max-w-4xl mx-auto px-4">
                <DynamicBreadcrumbs list={breadcrumbItems} />
                <h1 className="font-bold text-2xl sm:text-4xl mb-3 sm:mb-4">
                    {article.title}
                </h1>
                <div className="flex items-center gap-3">
                    <span className="sm:text-lg font-semibold">
                        {article.username}
                    </span>
                    <Badge>{article.tag}</Badge>
                </div>
                <AspectRatio ratio={16 / 9} className="bg-muted">
                    <Image
                        className="object-cover rounded-sm"
                        src={`/thumbnail/${article.thumbnail}`}
                        alt="thumbnail"
                        fill
                    />
                </AspectRatio>
                <p className="text-base my-4">{article.content}</p>
                <h2 className="font-semibold text-xl">Comments</h2>
                <Comment />
            </div>
        </>
    );
}
