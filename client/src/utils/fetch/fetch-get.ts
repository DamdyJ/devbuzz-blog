import axios from "axios";

export default async function GetFetch(url: string, comment: string) {
    try {
        const response = await axios.get(url);
        const data = response.data;
        return data;
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error("An unknown error occurred");
        }
        throw new Error(comment);
    }
}
