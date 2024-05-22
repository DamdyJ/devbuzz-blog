import { PrismaClient } from "@prisma/client";
import { inject, injectable } from "inversify";

@injectable()
export default class SessionService {
    constructor(@inject("PrismaClient") private prisma: PrismaClient) {}

    public async findSessionByUserId(userId: string) {
        return await this.prisma.session.findUnique({
            where: { user_id: userId },
        });
    }
    public async findSessionByRefreshToken(refreshToken: string) {
        return await this.prisma.session.findFirst({
            where: { refresh_token: refreshToken },
        });
    }

    public async update(userId: string, refreshToken: string, expiredAt: Date) {
        return await this.prisma.session.update({
            where: { user_id: userId },
            data: { refresh_token: refreshToken, expired_at: expiredAt },
        });
    }
    /**
     *
     * @param userId User ID from User Model
     * @param refreshToken Refresh Token that get generated from sign in or sign up
     * @param expiredAt Get the expired date from refresh token
     * @returns A promise that resolves to the created session object.
     */
    public async create(userId: string, refreshToken: string, expiredAt: Date) {
        return await this.prisma.session.create({
            data: {
                user_id: userId,
                refresh_token: refreshToken,
                expired_at: expiredAt,
            },
        });
    }

    public async delete(userId: string) {
        return await this.prisma.session.delete({ where: { user_id: userId } });
    }
}
