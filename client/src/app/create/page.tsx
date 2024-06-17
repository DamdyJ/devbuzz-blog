"use client";

import PageTransition from "@/components/page-transition";
import CreateArticleForm from "@/components/create-article-form";

export default function CreateArticlePage() {
    return (
        <>
            <PageTransition />
            <div className="w-full min-h-screen flex gap-4 flex-col items-center justify-center p-4">
                <h1 className="w-full text-3xl font-bold sm:w-2/3 sm:text-4xl lg:w-1/2">
                    Create
                </h1>
                <CreateArticleForm />
            </div>
        </>
    );
}
