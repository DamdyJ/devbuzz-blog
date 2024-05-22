import { PrismaClient } from "@prisma/client";
import { inject, injectable } from "inversify";

@injectable()
export default class TagService {
    constructor(@inject("PrismaClient") private prisma: PrismaClient) {}

    public async create(name: string) {
        return await this.prisma.tag.create({
            data: {
                name,
            },
        });
    }

    public async findAllTags() {
        return await this.prisma.tag.findMany();
    }

    public async findTagbyName(name: string) {
        return await this.prisma.tag.findUnique({ where: { name } });
    }
    public async findTagbyId(id: string) {
        return await this.prisma.tag.findUnique({ where: { id } });
    }
}
