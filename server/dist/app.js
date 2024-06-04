"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const client_1 = require("@prisma/client");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const library_1 = require("@prisma/client/runtime/library");
class App {
    app;
    constructor() {
        this.app = (0, express_1.default)();
        this.appConfig();
        this.prismaConfig();
    }
    appConfig() {
        this.app.use(express_1.default.json());
        this.app.use((0, morgan_1.default)("dev"));
        this.app.use((0, helmet_1.default)());
        this.app.use((0, cors_1.default)({ origin: "http://localhost:3000", credentials: true }));
        this.app.use((0, cookie_parser_1.default)());
    }
    async prismaConfig() {
        const prisma = new client_1.PrismaClient();
        try {
            await prisma.$connect();
            console.log("Connected to the database");
        }
        catch (error) {
            if (error instanceof library_1.PrismaClientInitializationError) {
                console.error("Failed to connect to the database:", error.message);
                console.error("Retrying connection in 5 seconds...");
                setTimeout(() => this.prismaConfig(), 5000);
            }
            else {
                console.error("Unknown error occurred while connecting to the database:", error);
            }
        }
        finally {
            await prisma.$disconnect();
        }
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map