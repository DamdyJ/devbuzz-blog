import { URL } from "../constant";
import axios from "axios";

export default async function fetchEditArticle(
    articleId: string,
    article: any
) {
    try {
        const response = await axios.post(
            URL.EDIT_ARTICLE + `/${articleId}`,
            article,
            {
                withCredentials: true,
            }
        );
        const data = response.data;
        return data;
    } catch (error: any) {
        console.log(error)
        if(error.message.includes('401')){
            throw new Error('Unauthorized user')
        }
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error("An unknown error occurred");
        }
        throw new Error("Fail fetch comment data");
    }
}
