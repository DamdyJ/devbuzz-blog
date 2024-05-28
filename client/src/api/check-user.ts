import axios from "axios";
import { URL } from "../constant";

export async function fetchCurrentUser() {
    try {
        const response = await axios.get(URL.GET_CURRENT_USER, {
            withCredentials: true,
        });
        const data = await response.data;
        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(error.message);
        } else {
            console.error("An unknown error occurred");
        }
        throw new Error("Failed to fetch new access token");
    }
}