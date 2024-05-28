import axios from "axios";
import { URL } from "../constant";

interface IArticle {
    article: {
        user: string;
        title: string;
        tag: string;
        thumbnail: string;
        content: string;
    };
    user: {
        id: string;
    };
}

export async function fetchGetArticle(id: string) {
    try {
        const response = await axios.get<IArticle>(
            URL.GET_SINGLE_ARTICLE + `/${id}`,
            {
                withCredentials: true,
            }
        );
        const data = response.data;
        return data;
    } catch (error: any) {
        if(error.message.includes('401')){
            throw new Error('Unauthorized user')
        }
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error("An unknown error occurred");
        }
        throw new Error("Fail fetch article data");
    }
}
