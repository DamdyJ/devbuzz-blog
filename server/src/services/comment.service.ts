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
                comment: comment,
            },
        });
    }

    public async findAllComments() {
        return await this.prisma.comment.findMany();
    }

    public async findCommentById(id: string) {
        return await this.prisma.comment.findUnique({ where: { id } });
    }
    public async findCommentByArticleId(articleId: string) {
        return await this.prisma.comment.findMany({
            where: { article_id: articleId }
        });
    }
}
