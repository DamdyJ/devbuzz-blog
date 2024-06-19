import { useEffect, useState } from "react";
import { fetchGetAllArticles } from "@/api/get-all-articles";

interface Article {
    id: string;
    title: string;
    thumbnail: string;
    username: string;
    tag: string;
    created_at: string;
}

export default function useArticles() {
    const [loading, setLoading] = useState(true);
    const [articles, setArticles] = useState<Article[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState("");
    const [loadingExceeded, setLoadingExceeded] = useState(false);
    const [topArticle, setTopArticle] = useState<Article | null>(null);

    const handleSearchInputChange = (value: string) => {
        setSearchInput(value);
        setPage(1);
        setArticles([]);
        setTopArticle(null);
    };

    useEffect(() => {
        let timer = setTimeout(() => {
            setLoadingExceeded(true);
        }, 3000);

        const fetchInitialData = async () => {
            try {
                const response = await fetchGetAllArticles(10, 1, searchInput);
                clearTimeout(timer);
                const processedArticles = response.map((article: any) => {
                    const splitUrl = article.thumbnail.split("\\");
                    const imageUrl = splitUrl[splitUrl.length - 1];
                    return {
                        ...article,
                        thumbnail: imageUrl,
                    };
                });

                if (processedArticles.length === 0) {
                    setHasMore(false);
                } else {
                    setTopArticle(processedArticles[0]);
                    setArticles(processedArticles.slice(1));
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching articles:", error);
                setLoading(false);
            }
        };

        fetchInitialData();

        return () => clearTimeout(timer);
    }, [searchInput]);

    useEffect(() => {
        const fetchMoreData = async () => {
            try {
                const response = await fetchGetAllArticles(
                    10,
                    page,
                    searchInput
                );
                const processedArticles = response.map((article: any) => {
                    const splitUrl = article.thumbnail.split("\\");
                    const imageUrl = splitUrl[splitUrl.length - 1];
                    return {
                        ...article,
                        thumbnail: imageUrl,
                    };
                });

                if (response.length === 0) {
                    setHasMore(false);
                } else {
                    setArticles((prevArticles) =>
                        prevArticles.concat(processedArticles)
                    );
                }
            } catch (error) {
                console.error("Error fetching articles:", error);
            }
        };

        if (page > 1) {
            fetchMoreData();
        }
    }, [page, searchInput]);

    const fetchMoreData = () => {
        setTimeout(() => {
            setPage((prevPage) => prevPage + 1);
        }, 1500);
    };

    return {
        articles,
        topArticle,
        hasMore,
        fetchMoreData,
        handleSearchInputChange,
        loading,
        loadingExceeded,
    };
}
