import axios from "axios";
import { URL } from "../constant";

export interface IArticle {
    title: string;
    tag: string;
    thumbnail: string;
    content: string;
}

export default async function fetchCreateArticle(article: any) {
    try {
        const response = await axios.post(URL.CREATE_ARTICLE, article, {
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
        throw new Error("Fail fetch article data");
    }
}

