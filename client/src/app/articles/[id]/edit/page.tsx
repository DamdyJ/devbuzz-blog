'use client'
import useAuth from "@/hooks/useAuth";

export default function ArticleEditPage() {
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
    <div>ArticleEditPage</div>
  )
}
