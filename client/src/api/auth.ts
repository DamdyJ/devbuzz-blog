// utils/auth.ts
import axios from "axios";
import { URL } from "../constant";

export async function fetchNewAccessToken() {
    try {
        const response = await axios.get(URL.NEW_ACCESS_TOKEN, {
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

export async function fetchVerifyToken() {
    try {
        const response = await axios.get(URL.VERIFY_TOKEN, {
            withCredentials: true,
        });
        const data = await response.data;
        return  data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(error.message);
        } else {
            console.error("An unknown error occurred");
        }
        throw new Error("Failed to fetch new access token");
    }
}
