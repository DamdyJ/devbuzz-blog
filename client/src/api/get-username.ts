import axios from "axios";
import { URL } from "../constant";

export default async function fetchGetUsername(userId: string) {
    try {
        const response = await axios.get(URL.GET_USERNAME + `/${userId}`, {
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
        throw new Error("Fail fetch username data");
    }
}
