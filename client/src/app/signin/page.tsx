"use client";
import { Button } from "@/components/ui/button";

import PageTransition from "@/components/page-transition";
import Link from "next/link";
import SignInForm from "@/components/signin-form";

export default function SignInPage() {
    return (
        <>
            <PageTransition />
            <div className="w-full min-h-screen flex gap-4 flex-col items-center justify-center">
                <h1 className="text-3xl font-bold md:text-4xl">Welcome back</h1>
                <SignInForm />
                <div className="flex items-center">
                    <p>Don&apos;t have account?</p>
                    <Link href={"/signup"}>
                        <Button variant="link">Create one</Button>
                    </Link>
                </div>
            </div>
        </>
    );
}
