import { PrismaClient } from "@prisma/client";
import { injectable, inject } from "inversify";

@injectable()
export default class ProfileService {
    constructor(@inject("PrismaClient") private prisma: PrismaClient) {}

    public async create(userId: string, userBio: string, profileImage: any) {
        return await this.prisma.profile.create({
            data: {
                user_id: userId,
                user_bio: userBio,
                profile_image: profileImage,
            },
        });
    }

    public async findProfileById(userId: string) {
        return await this.prisma.profile.findUnique({
            where: { user_id: userId },
        });
    }

    public async update(userId: string, userBio: string, profileImage: any) {
        return await this.prisma.profile.update({
            where: { user_id: userId },
            data: { user_bio: userBio, profile_image: profileImage },
        });
    }
}
