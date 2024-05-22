import "reflect-metadata";
import express, { Application } from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import cookieParser from "cookie-parser";
import { PrismaClientInitializationError } from "@prisma/client/runtime/library";

class App {
    public app: Application;

    constructor() {
        this.app = express();
        this.appConfig();
        this.prismaConfig();
    }

    private appConfig() {
        this.app.use(express.json());
        this.app.use(morgan("dev"));
        this.app.use(helmet());
        this.app.use(
            cors({ origin: "http://localhost:3000", credentials: true })
        );
        this.app.use(cookieParser());
    }
   
    private async prismaConfig() {
        const prisma = new PrismaClient();
        try {
            await prisma.$connect();
            console.log("Connected to the database");
        } catch (error) {
            if (error instanceof PrismaClientInitializationError) {
                console.error(
                    "Failed to connect to the database:",
                    error.message
                );
                console.error("Retrying connection in 5 seconds...");
                setTimeout(() => this.prismaConfig(), 5000);
            } else {
                console.error(
                    "Unknown error occurred while connecting to the database:",
                    error
                );
            }
        } finally {
            await prisma.$disconnect();
        }
    }
}
export default App;
