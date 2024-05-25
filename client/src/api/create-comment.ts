import { URL } from "../constant";
import axios from "axios";

export interface IComment {
    comment: string;
}

export default async function fetchCreateCommet(
    articleId: string,
    comment: any
) {
    try {
        const response = await axios.post(
            URL.POST_COMMENT,
            {
                articleId,
                comment,
            },
            {
                withCredentials: true,
            }
        );
        const data = response.data;
        return data;
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error("An unknown error occurred");
        }
        throw new Error("Fail fetch comment data");
    }
}
