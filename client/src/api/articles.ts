import axios from "axios";
import { URL } from "../constant";

export interface IArticle {
    title: string;
    tagId: string;
    thumbnail: string;
    content: string;
}

export default async function fetchSignUp(article: IArticle) {
    try {
        const response = await axios.post(URL.SIGNUP, article, {
            withCredentials: true,
        });
        const data = await response.data;
        console.log(data)
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
