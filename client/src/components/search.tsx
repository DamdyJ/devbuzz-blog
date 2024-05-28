import React, { useState } from "react";
import { Input } from "./ui/input";

export default function Search({ onSearch }: any) {
    const [searchInput, setSearchInput] = useState("");

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSearchInput(value); // Update the local state with the input value
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            // Trigger the search callback when Enter is pressed
            onSearch(searchInput);
        }
    };

    return (
        <div className="text-black w-full pl-8 pr-4">
            <Input
                type="search"
                placeholder="Search... (ex: title, tag)"
                value={searchInput}
                onChange={handleChange}
                onKeyDown={handleKeyDown} // Call handleKeyDown on key down
            />
        </div>
    );
}
