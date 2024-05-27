import axios from "axios";
import { URL } from "../constant";

export async function fetchGetProfile(username: string) {
    try {
        const response = await axios.get(URL.GET_PROFILE + `/${username}`);
        const data = await response.data;
        return data;
    } catch (error) {
        console.log(error)
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error("An unknown error occurred");
        }
        throw new Error("Fail fetch profile data");
    }
}
