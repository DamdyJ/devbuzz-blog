import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import Image from "next/image";
import Search from "./search";
import { useEffect, useState } from "react";
import { fetchProfileImage } from "@/api/get-profile-image";

interface ProfileState {
    username: string;
    image: string;
}

export default function NavbarLogin({ onSearch }: any) {
    const [profile, setProfile] = useState<ProfileState>({
        username: "",
        image: "",
    });
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchProfileImage();
                const username = response.username;
                const splitUrl = response.profileImage.split("\\");
                const imageUrl = splitUrl[splitUrl.length - 1];
                setProfile({
                    username,
                    image: imageUrl,
                });
            } catch (error) {
                console.error("Error fetching new access token:", error);
            }
        };

        fetchData();
    }, []);
    return (
        <>
            <div className="w-full h-16 bg-black">
                <nav className="flex max-w-5xl h-full mx-auto text-white justify-between items-center px-4">
                    <Image
                        className="h-8 w-auto"
                        src={"/DevBuzz_Logo.svg"}
                        alt="DevBuzz"
                        priority
                        width={160}
                        height={40}
                        sizes="(max-height: 40px)"
                    />
                    <Search onSearch={onSearch} />
                    <div className="flex gap-3 sm:gap-8">
                        <Link href={"/create"}>
                            <Button
                                className="bg-transparant text-white"
                                variant="link"
                            >
                                Write
                            </Button>
                        </Link>
                        <Link href={`/profile/${profile.username}`}>
                            <Avatar>
                                <AvatarImage
                                    src={`/${profile.image}`}
                                    alt="@shadcn"
                                />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </Link>
                    </div>
                </nav>
            </div>
        </>
    );
}
