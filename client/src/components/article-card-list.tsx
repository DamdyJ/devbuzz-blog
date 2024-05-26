import React from "react";
import ArticleCard from "./article-card";
import formatDate from "@/utils/date-formatter";

interface Article {
    id: string;
    title: string;
    thumbnail: string;
    username: string;
    tag: string;
    created_at: string;
}

interface ArticleCardListProps {
    ArticleData: Article[];
}

export default function ArticleCardList({
    ArticleData,
}: ArticleCardListProps): JSX.Element {
    return (
        <>
            {ArticleData &&
                ArticleData.map((article, index) => {
                    return (
                        <ArticleCard
                            key={index}
                            id={article.id}
                            title={article.title}
                            thumbnail={article.thumbnail}
                            username={article.username}
                            tag={article.tag}
                            createdAt={formatDate(article.created_at)}
                        />
                    );
                })}
        </>
    );
}
