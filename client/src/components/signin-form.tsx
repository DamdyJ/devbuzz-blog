import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignIn, SignInSchema } from "@/utils/validations/signin-validation";

import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import SignInFetch from "@/utils/fetch/signin";
import { Button } from "./ui/button";

export default function SignInForm() {
    const router = useRouter();

    const form = useForm<SignIn>({
        resolver: zodResolver(SignInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(data: SignIn) {
        try {
            await SignInFetch(data);
            toast({
                title: "Sign in successful",
            });
            router.push("/");
        } catch (error) {
            toast({
                title: "Sign in failed",
                description: "Please check your credentials and try again.",
            });
        }
    }
    return (
        <>
            <Form {...form}>
                <form
                    method="POST"
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-3/4 space-y-4 md:w-2/3 md:space-y-6 lg:w-1/2"
                >
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
        </>
    );
}
