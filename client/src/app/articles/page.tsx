'use client'
import fetchNewAccessToken from "@/api/auth";
import React from "react";

export default function ArticlesPage() {
    async function API() {
        try {
            await fetchNewAccessToken();
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div>
            <button onClick={API}>CLICK</button>
        </div>
    );
}
