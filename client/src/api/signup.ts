import axios from "axios";
import { URL } from "../constant";

export interface ISignUp {
    email: string;
    password: string;
}

export default async function fetchSignUp(user: ISignUp) {
    try {
        const response = await axios.post(URL.SIGNUP, user, {
            withCredentials: true,
        });
        const data = await response.data;
        return data;
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error("An unknown error occurred");
        }
        throw new Error("Fail fetch sign up data");
    }
}
