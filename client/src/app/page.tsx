"use client";
import PageTransition from "@/components/page-transition";
import useAuth from "@/hooks/useAuth";

export default function YourPage() {
    const { loading, authenticated } = useAuth();

    if (loading) {
        return (
            <div>
                <h1>Loading...</h1>
            </div>
        );
    }

    if (!authenticated) {
        return null;
    }

    return (
        <>
            <PageTransition />
            <main>
                <h1>Main</h1>
            </main>
        </>
    );
}
