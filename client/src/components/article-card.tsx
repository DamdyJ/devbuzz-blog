import { Badge } from "./ui/badge";
import React from "react";
import { AspectRatio } from "./ui/aspect-ratio";
import Image from "next/image";
import Link from "next/link";

interface ArticleCardProps {
    id: string;
    thumbnail: string;
    title: string;
    username: string;
    tag: string;
    createdAt: string;
}

export default function ArticleCard({
    id,
    thumbnail,
    title,
    username,
    tag,
    createdAt,
}: ArticleCardProps): JSX.Element {
    return (
        <Link className="mb-4" href={`/articles/${id}`}>
            <AspectRatio ratio={16 / 9} className="bg-muted">
                <Image
                    src={`/thumbnail/${thumbnail}`}
                    alt={thumbnail}
                    className="rounded-md object-cover"
                    fill
                    priority
                    sizes="(max-width: 488px)"
                />
            </AspectRatio>
            <h2 className="text-3xl font-bold">{title}</h2>
            <div className="flex items-center justify-between py-3">
                <div className="flex gap-2">
                    <span className="font-semibold">@{username}</span>
                    <Badge>{tag}</Badge>
                </div>
                <span>{createdAt}</span>
            </div>
        </Link>
    );
}
