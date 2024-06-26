import { motion } from "framer-motion";
import React from "react";

export default function PageTransition() {
    return (
        <>
            <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 0 }}
                exit={{ scaleY: 1 }}
                transition={{
                    delay: 0.1,
                    duration: 1,
                    ease: [0.22, 1, 0.36, 1],
                }}
                className="fixed top-0 left-0 w-full h-screen bg-black origin-bottom z-50"
            ></motion.div>
            <motion.div
                initial={{ scaleY: 1 }}
                animate={{ scaleY: 0 }}
                exit={{ scaleY: 0 }}
                transition={{
                    delay: 0.1,
                    duration: 1,
                    ease: [0.22, 1, 0.36, 1],
                }}
                className="fixed top-0 left-0 w-full h-screen bg-black origin-top z-50"
            ></motion.div>
        </>
    );
}
