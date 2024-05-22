import { PrismaClient } from "@prisma/client";
import { inject, injectable } from "inversify";
import jwt, { JwtPayload } from "jsonwebtoken";
import { TOKEN } from "../constants";

@injectable()
export default class AuthService {
    constructor(@inject("PrismaClient") private prisma: PrismaClient) {}

    public async verifyToken(token: string): Promise<string | JwtPayload> {
        return jwt.verify(token, TOKEN.ACCESS_TOKEN_SECRET);
    }
    public async verifyRefreshToken(
        token: string
    ): Promise<string | JwtPayload> {
        return jwt.verify(token, TOKEN.REFRESH_TOKEN_SECRET);
    }
}
