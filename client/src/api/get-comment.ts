import { URL } from "../constant";
import axios from "axios";

interface IComment {
    id: string;
    user_id: string;
    articleId: string;
    comment: string;
    created_at: string;
    profileImage: string;
}

export default async function fetchGetCommets(params: string) {
    try {
        const response = await axios.get<IComment[]>(
            URL.GET_COMMENT + `/${params}`
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
