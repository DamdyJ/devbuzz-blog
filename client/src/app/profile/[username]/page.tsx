"use client";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { fetchGetProfile } from "@/api/get-profile";
import formatDate from "@/utils/date-formatter";
import { toast } from "@/components/ui/use-toast";
import Loading from "@/components/loading";
import PageTransition from "@/components/page-transition";
export default function ProfilePage() {
    const params = useParams<{ username: string }>();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState({
        username: "",
        image: "",
        bio: "",
        joinSince: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetchGetProfile(params.username);
                const username = response.user.username;
                const profile = response.profile;
                const splitUrl = profile.profile_image.split("\\");
                const imageUrl = splitUrl[splitUrl.length - 1];
                setProfile({
                    username,
                    image: imageUrl,
                    bio: profile.user_bio,
                    joinSince: formatDate(profile.created_at),
                });

                setLoading(false);
            } catch (error) {
                console.error("Error fetching new access token:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params.username]);

    const handleShareClick = () => {
        const url = window.location.href;
        navigator.clipboard
            .writeText(url)
            .then(() => {
                toast({
                    title: "URL copied to clipboard!",
                });
            })
            .catch((err) => {
                toast({
                    title: "Failed to copy user profile URL",
                });
            });
    };

    if (loading) {
        return (
            <div>
                <Loading />
            </div>
        );
    }

    return (
        <>
            <PageTransition />
            <div className=" w-full max-w-3xl min-h-screen justify-center mx-auto flex flex-col gap-1 p-4 items-center">
                <div className="relative w-full">
                    <Link href="/">
                        <Button
                            className="absolute left-0 top-0"
                            variant="outline"
                            size="icon"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div className="flex flex-col items-center">
                        <span className="text-xl font-semibold">Profile</span>
                        <Avatar className="w-32 h-32 md:w-48 md:h-48">
                            <AvatarImage
                                src={`/${profile.image}`}
                                alt={`@${profile.username}`}
                            />
                            <AvatarFallback>{profile.username}</AvatarFallback>
                        </Avatar>
                        <p className="font-semibold mb-16 md:24">
                            @{profile.username}
                        </p>
                    </div>
                </div>
                <div className="w-full grid gap-3">
                    <div>
                        <span className="text-lg font-medium">Bio</span>
                        <p>{profile.bio}</p>
                    </div>
                    <div>
                        <span className="text-lg font-medium">Join Since</span>
                        <p className="">{profile.joinSince}</p>
                    </div>
                    <div className="flex gap-4">
                        <Button
                            onClick={handleShareClick}
                            className="w-full"
                            variant="outline"
                        >
                            Share
                        </Button>
                        {/* <Link
                            className="w-full"
                            href={`/profile/${params.username}/edit`}
                        >
                            <Button className="w-full">Edit</Button>
                        </Link> */}
                    </div>
                </div>
            </div>
        </>
    );
}
