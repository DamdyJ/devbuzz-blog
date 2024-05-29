"use client";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchGetAllArticles } from "@/api/get-all-articles";
import ArticleCardList from "@/components/article-card-list";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import formatDate from "@/utils/date-formatter";
import Image from "next/image";
import PageTransition from "@/components/page-transition";
import Link from "next/link";
import NavbarLogin from "@/components/navbar-login";
import Loading from "@/components/loading";
import useAuth from "@/hooks/useAuth";

export default function ArticlesPage() {
    const { authenticated } = useAuth();
    const [loading, setLoading] = useState(true);
    const [articles, setArticles] = useState([]);
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
        const fetchData = async () => {
            try {
                const response = await fetchGetAllArticles(
                    10,
                    page,
                    searchInput
                );
                clearTimeout(timer);
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
                    setTopArticle(processedArticles[0]);
                    setArticles((prevArticles) =>
                        prevArticles.concat(processedArticles.slice(1))
                    );
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching articles:", error);
                setLoading(false);
            }
        };

        fetchData();
        return () => clearTimeout(timer);
    }, [page, searchInput]);

    const fetchMoreData = () => {
        setTimeout(() => {
            setPage((prevPage) => prevPage + 1);
        }, 1500);
    };
    interface Article {
        id: string;
        title: string;
        thumbnail: string;
        username: string;
        tag: string;
        created_at: string;
    }

    if (loading) {
        return <Loading />;
    }

    if (!authenticated) {
        return null;
    }
    return (
        <>
            <PageTransition />
            <NavbarLogin onSearch={handleSearchInputChange} />
            <div className="grid grid-cols-1 w-full max-w-5xl px-4 mx-auto gap-4">
                {topArticle && (
                    <>
                        <div className="font-semibold text-xl sm:text-3xl mt-4">
                            Most Recent Article
                        </div>
                        <Link
                            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                            href={`/${topArticle.id}`}
                        >
                            <AspectRatio ratio={16 / 9} className="bg-muted">
                                <Image
                                    className="rounded-md object-cover"
                                    src={`/thumbnail/${topArticle.thumbnail}`}
                                    alt={topArticle.thumbnail}
                                    fill
                                    priority
                                    sizes="(max-width: 488px)"
                                />
                            </AspectRatio>
                            <div className="flex flex-col justify-between">
                                <h1 className="text-3xl sm:text-5xl font-bold">
                                    {topArticle.title}
                                </h1>
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-2">
                                        <span className="font-semibold">
                                            @{topArticle.username}
                                        </span>
                                        <Badge>{topArticle.tag}</Badge>
                                    </div>
                                    <span>
                                        {formatDate(topArticle.created_at)}
                                    </span>
                                </div>
                            </div>
                        </Link>
                        <div className="font-semibold text-xl sm:text-3xl mt-4">
                            See More
                        </div>
                    </>
                )}
                <InfiniteScroll
                    className="grid gap-4 grid-cols-1 sm:grid-cols-2 "
                    dataLength={articles.length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                    loader={
                        <>
                            {loadingExceeded && articles.length === 0 && (
                                <div className="col-span-1 sm:col-span-2 flex items-center justify-center my-4 overflow-hidden">
                                    No data available.
                                </div>
                            )}
                            <div
                                className="col-span-1 sm:col-span-2 flex items-end justify-center my-4 overflow-hidden"
                                role="status"
                            >
                                <svg
                                    aria-hidden="true"
                                    className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                    viewBox="0 0 100 101"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                        fill="currentColor"
                                    />
                                    <path
                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                        fill="currentFill"
                                    />
                                </svg>
                                <span className="sr-only">Loading...</span>
                            </div>
                        </>
                    }
                    endMessage={
                        <>
                            <div className="col-span-1 sm:col-span-2 flex items-center justify-center my-4 overflow-hidden">
                                No data available.
                            </div>
                        </>
                    }
                >
                    <ArticleCardList ArticleData={articles} />
                </InfiniteScroll>
            </div>
        </>
    );
}
