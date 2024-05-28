"use client";

import { fetchGetArticle } from "@/api/get-single-article";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import Comment from "@/components/comment";
import DynamicBreadcrumbs, {
    BreadcrumbItemType,
} from "@/components/dynamic-breadcrumb";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import PageTransition from "@/components/page-transition";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { fetchCurrentUser } from "@/api/check-user";
import Link from "next/link";
import Navbar from "@/components/navbar";
import { fetchGetProfile } from "@/api/get-profile";

export default function ArticlePage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const [loading, setLoading] = useState(true);
    const [unauthorized, setUnauthorized] = useState(false);
    const [profileImage, setProfileImage] = useState<string>();
    const [edit, setEdit] = useState(false);
    const [article, setArticle] = useState({
        username: "",
        title: "",
        tag: "",
        thumbnail: "",
        content: "",
    });

    const breadcrumbItems: BreadcrumbItemType[] = [
        { label: "Home", href: "/" },
    ];

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const articleResponse = await fetchGetArticle(params.id);
                console.log(articleResponse)
                const articleData = await articleResponse.article;
                const user = articleResponse.user;
                const splitUrl = articleData.thumbnail.split("\\");
                const imageUrl = splitUrl[splitUrl.length - 1];
                const currentUserResponse = await fetchCurrentUser();
                if (currentUserResponse.id === user.id) {
                    setEdit(true);
                }
                setArticle({
                    username: articleData.user,
                    title: articleData.title,
                    tag: articleData.tag,
                    thumbnail: imageUrl,
                    content: articleData.content,
                });
                const profileResponse = await fetchGetProfile(articleData.user);
                const splitProfileImageURL = profileResponse.profile.profile_image.split("\\");
                const profileImageURL = splitProfileImageURL[splitProfileImageURL.length - 1];
                setProfileImage(profileImageURL);
            } catch (error: any) {
                setLoading(true);
                console.error(
                    "Error fetching profile data:",
                    error.message
                );
                if (error.message.includes("Unauthorized")) {
                    setUnauthorized(true);
                    router.push("/signin");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params.id, profileImage]);

    if (loading) {
        return <Loading />;
    }

    if (unauthorized) {
        return null;
    }

    return (
        <>
            <PageTransition />
            <Navbar />
            <div className="w-full max-w-4xl mx-auto p-4">
                <div className="flex justify-between items-center">
                    <DynamicBreadcrumbs list={breadcrumbItems} />
                    {edit ? (
                        <Link href={`/${params.id}/edit`}>
                            <Button variant="secondary">Edit</Button>
                        </Link>
                    ) : (
                        ""
                    )}
                </div>
                <h1 className="font-bold text-2xl sm:text-4xl mb-3 sm:mb-4">
                    {article.title}
                </h1>
                <div className="flex items-center gap-3">
                    <span className="sm:text-lg font-semibold">
                        @{article.username}
                    </span>
                    <Badge>{article.tag}</Badge>
                </div>
                <AspectRatio ratio={16 / 9} className="bg-muted">
                    <Image
                        className="object-cover rounded-sm"
                        src={`/thumbnail/${article.thumbnail}`}
                        alt="thumbnail"
                        fill
                        priority
                        sizes="(max-width: 864px)"
                    />
                </AspectRatio>
                <p className="text-base my-4">{article.content}</p>
                <h2 className="font-semibold text-xl">Comments</h2>
                <Comment profileImage={profileImage} />
            </div>
        </>
    );
}
