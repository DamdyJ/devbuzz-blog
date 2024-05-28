"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchGetArticle } from "@/api/get-single-article";
import DynamicBreadcrumbs, {
    BreadcrumbItemType,
} from "@/components/dynamic-breadcrumb";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import PageTransition from "@/components/page-transition";
import Editor from "@/components/editor";
import Loading from "@/components/loading";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

export default function EditArticlePage() {
    const { authenticated } = useAuth();
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState("");
    const [title, setTitle] = useState("");
    const [tag, setTag] = useState("");
    const [thumbnail, setThumbnail] = useState("");
    const [content, setContent] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const articleResponse = await fetchGetArticle(params.id);
                const articleData = await articleResponse.article;
                const splitUrl = articleData.thumbnail.split("\\");
                const imageUrl = splitUrl[splitUrl.length - 1];
                setUsername(articleData.user);
                setTitle(articleData.title);
                setTag(articleData.tag);
                setThumbnail(imageUrl);
                setContent(articleData.content);
                setLoading(false);
            } catch (error: any) {
                if (error.message.includes("Unauthorized")) {
                    router.push("/signin");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params.id]);

    if (loading) {
        return <Loading />;
    }
    if (!authenticated) {
        return null;
    }
    const breadcrumbItems: BreadcrumbItemType[] = [
        { label: "Home", href: "/" },
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
                                sizes="(max-width: 608px)"
                                priority
                                fill
                            />
                        )}
                    </AspectRatio>
                    <p className="text-base my-4">{content}</p>
                </div>
                {/* Editor */}
                <Editor
                    title={title}
                    setTitle={setTitle}
                    tag={tag}
                    setTag={setTag}
                    thumbnail={thumbnail}
                    setThumbnail={setThumbnail}
                    content={content}
                    setContent={setContent}
                />
            </div>
        </>
    );
}
