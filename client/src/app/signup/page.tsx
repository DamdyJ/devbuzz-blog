"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpSchema } from "@/utils/validations/signup-validation";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormDescription,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import fetchSignUp, { ISignUp } from "../../api/signup";

export default function SignUpPage() {
    const router = useRouter();

    const form = useForm<z.infer<typeof SignUpSchema>>({
        resolver: zodResolver(SignUpSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    });

    async function onSubmit(data: z.infer<typeof SignUpSchema>) {
        try {
            await fetchSignUp(data as ISignUp);
            toast({
                title: "Sign up successful",
            });
            router.push("/");
        } catch (error) {
            toast({
                title: "Sign up failed",
                description: "Please check your credentials and try again.",
            });
        }
    }

    return (
        <div className="w-full min-h-screen flex gap-4 flex-col items-center justify-center">
            <h1 className="text-3xl font-bold md:text-4xl">Welcome back</h1>
            <Form {...form}>
                <form
                    method="POST"
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-3/4 space-y-4 md:w-2/3 md:space-y-6 lg:w-1/2"
                >
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <Input
                                    type="text"
                                    placeholder="username"
                                    {...field}
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <Input
                                    type="email"
                                    placeholder="name@example.com"
                                    {...field}
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <Input
                                    type="password"
                                    placeholder="password"
                                    {...field}
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button className="w-full" type="submit">
                        Signin
                    </Button>
                </form>
            </Form>
        </div>
    );
}
