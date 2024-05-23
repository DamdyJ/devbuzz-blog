'use client'
import useAuth from '@/hooks/useAuth';

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
        <main>
            <h1>Main</h1>
        </main>
    );
}
