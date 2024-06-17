import axios from "axios";
import { URL } from "@/constant";
import { SignIn, SignInSchema } from "../validations/signin-validation";

export default async function SignInFetch(user: SignIn) {
    try {
        const response = await axios.post(URL.SIGNIN, user, {
            withCredentials: true,
        });
        const data: SignIn = response.data;
        const validateData = SignInSchema.safeParse(data);
        if (!validateData.success) {
            console.error(validateData.error);
            return;
        }
        return validateData.data;
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error("An unknown error occurred");
        }
        throw new Error("Fail to fetch signin api");
    }
}
