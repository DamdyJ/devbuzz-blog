import axios from "axios";
import { URL } from "../constant";

export async function fetchGetAllArticles(
    limit: number | 10,
    page: number | 1,
    q: string | ""
) {
    try {
        const response = await axios.get(
            URL.GET_ALL_ARTICLES + `?limit=${limit}&page=${page}&q=${q}`,
            {
                withCredentials: true,
            }
        );
        const data = await response.data.articles;
        return data;
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error("An unknown error occurred");
        }
        throw new Error("Fail fetch articles data");
    }
}
