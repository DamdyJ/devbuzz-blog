import { PrismaClient } from "@prisma/client";
import { inject, injectable } from "inversify";

@injectable()
export default class UserService {
    constructor(@inject("PrismaClient") private prisma: PrismaClient) {}

    /**
     * 
     * @param username 
     * @param email 
     * @param password 
     * @returns 
     */
    public async create(username: string, email: string, password: string) {
        return await this.prisma.user.create({
            data: { username, email, password },
        });
    }

    /**
     * 
     * @returns user promise
     */
    public async findAllUsers() {
        return await this.prisma.user.findMany();
    }

    public async findUserById(id: string) {
        return await this.prisma.user.findFirst({ where: { id } });
    }

    public async findUserByEmail(email: string) {
        return await this.prisma.user.findFirst({
            where: { email },
        });
    }

    public async findUserByUsername(username: string) {
        return await this.prisma.user.findFirst({ where: { username } });
    }
    public async findUserByIdAndGetEmail(id: string) {
        return await this.prisma.user.findFirst({
            where: { id },
            select: { email: true },
        });
    }
}
