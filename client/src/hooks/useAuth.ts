"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchNewAccessToken, fetchVerifyToken } from "@/api/auth";

export default function useAuth() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const verify = await fetchVerifyToken();
                if (!verify) {
                    await fetchNewAccessToken();
                    setAuthenticated(true);
                }
                setAuthenticated(true);
            } catch (error) {
                console.error("Error fetching new access token:", error);
                router.push("/signin");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    return { loading, authenticated };
}
