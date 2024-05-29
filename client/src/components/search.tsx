import React, { useState } from "react";
import { Input } from "./ui/input";

export default function Search({ onSearch }: any) {
    const [searchInput, setSearchInput] = useState("");

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSearchInput(value);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            onSearch(searchInput);
        }
    };

    return (
        <div className="text-black w-full sm:pl-8 sm:pr-4">
            <Input
                type="search"
                placeholder="Search... (ex: title, tag)"
                value={searchInput}
                onChange={handleChange}
                onKeyDown={handleKeyDown} 
            />
        </div>
    );
}
