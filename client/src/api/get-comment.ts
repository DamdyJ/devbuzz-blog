import { URL } from "../constant";
import axios from "axios";

interface IComment {
    id: string;
    userId: string;
    articleId: string;
    commet: string;
    createdAt: string;
}

export default async function fetchGetCommets() {
    try {
        const response = await axios.get<IComment>(URL.GET_COMMENT);
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
