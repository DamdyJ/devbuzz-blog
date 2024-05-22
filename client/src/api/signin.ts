import axios from "axios";
import { URL } from "../constant";

export interface ISignIn {
    email: string;
    password: string;
}

export default async function fetchSignIn(user: ISignIn) {
    try {
        const response = await axios.post(URL.SIGNIN, user, {
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
        throw new Error("Fail fetch sign in data");
    }
}
