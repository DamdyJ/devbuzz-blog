import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import formatDate from "@/utils/date-formatter";
import Image from "next/image";
import Link from "next/link";

interface MostRecentArticleProps {
    article: {
        id: string;
        title: string;
        thumbnail: string;
        username: string;
        tag: string;
        created_at: string;
    };
}

export default function MostRecentArticle({ article }: MostRecentArticleProps) {
    return (
        <>
            <div className="font-semibold text-xl sm:text-3xl mt-4">
                Most Recent Article
            </div>
            <Link
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                href={`/${article.id}`}
            >
                <AspectRatio ratio={16 / 9} className="bg-muted">
                    <Image
                        className="rounded-md object-cover"
                        src={`/thumbnail/${article.thumbnail}`}
                        alt={article.thumbnail}
                        fill
                        priority
                        sizes="(max-width: 488px)"
                    />
                </AspectRatio>
                <div className="flex flex-col justify-between">
                    <h1 className="text-3xl sm:text-5xl font-bold">
                        {article.title}
                    </h1>
                    <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                            <span className="font-semibold">
                                @{article.username}
                            </span>
                            <Badge>{article.tag}</Badge>
                        </div>
                        <span>{formatDate(article.created_at)}</span>
                    </div>
                </div>
            </Link>
            <div className="font-semibold text-xl sm:text-3xl mt-4">
                See More
            </div>
        </>
    );
}
