import { PrismaClient } from "@prisma/client";
import { inject, injectable } from "inversify";

@injectable()
export default class CommentService {
    constructor(@inject("PrismaClient") private prisma: PrismaClient) {}

    public async create(userId: string, articleId: string, comment: string) {
        return await this.prisma.comment.create({
            data: {
                user_id: userId,
                article_id: articleId,
                comment,
            },
        });
    }

    public async findAllComments() {
        return await this.prisma.comment.findMany();
    }
}
