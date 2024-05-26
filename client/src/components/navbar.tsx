import React from "react";
import { Button } from "./ui/button";

export default function Navbar() {
    return (
        <>
            <div className="w-full h-16 bg-black">
                <nav className="flex max-w-5xl h-full mx-auto text-white justify-between items-center px-4">
                    <div>Logo</div>
                    <ul className="flex gap-4">
                        <li>
                            <Button
                                className="bg-transparant"
                                variant="outline"
                            >
                                Sign In
                            </Button>
                        </li>
                        <li>
                            <Button className="bg-white text-black hover:bg-white/80">
                                Sign Up
                            </Button>
                        </li>
                    </ul>
                </nav>
            </div>
        </>
    );
}
