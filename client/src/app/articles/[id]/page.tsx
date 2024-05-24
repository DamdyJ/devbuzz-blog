"use client";
import { fetchGetArticle } from "@/api/get-single-article";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
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
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetchGetArticle(params.id);
                const splitUrl = response.thumbnail.split("\\");
                const imageUrl = splitUrl[splitUrl.length - 1]; 
                setArticle({
                    username: response.user,
                    title: response.title,
                    tag: response.tag,
                    thumbnail: imageUrl,
                    content: response.content,
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
                <h1 className="font-bold text-3xl md:text-4xl">
                    {article.title}
                </h1>
                <span className="md:text-lg">@{article.username}</span>
                <Image
                    className="w-full max-h-[486px]"
                    src={`/thumbnail/${article.thumbnail}`}
                    alt="thumbnail"
                    width={864}
                    height={(864 / 16) * 9}
                />
                <Badge>{article.tag}</Badge>
                <p>{article.content}</p>
            </div>
        </>
    );
}
