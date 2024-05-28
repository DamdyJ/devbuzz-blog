import axios from "axios";
import { URL } from "../constant";

export async function fetchProfileImage() {
    try {
        const respomse = await axios.get(URL.GET_PROFILE_IMAGE, {
            withCredentials: true,
        });
        const data = await respomse.data;
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
