import { PrismaClient } from "@prisma/client";
import { injectable, inject } from "inversify";

@injectable()
export default class ArticleService {
    constructor(@inject("PrismaClient") private prisma: PrismaClient) {}

    /**
     *
     * @param userId
     * @param title
     * @param tagId
     * @param thumbnail
     * @param content
     * @returns
     */
    public async create(
        userId: string,
        title: string,
        tagId: string,
        thumbnail: string,
        content: string
    ) {
        return await this.prisma.article.create({
            data: {
                user_id: userId,
                title,
                tag_id: tagId,
                thumbnail,
                content,
            },
        });
    }

    public async findAllArticles() {
        return await this.prisma.article.findMany();
    }

    public async findArticleById(id: string) {
        return await this.prisma.article.findUnique({ where: { id } });
    }

    public async delete(id: string) {
        return await this.prisma.article.delete({ where: { id } });
    }

    public async findArticleByAuthor(authorId: string) {
        return await this.prisma.article.findFirst({
            where: { user_id: authorId },
        });
    }

    public async findArticleByTitle(search: string) {
        return await this.prisma.article.findMany({
            where: {
                title: {
                    contains: search,
                },
            },
        });
    }

    public async editArticle(
        id: string,
        title: string,
        tagId: string,
        thumbnail: any,
        content: string
    ) {
        return await this.prisma.article.update({
            where: { id },
            data: { title, tag_id: tagId, thumbnail, content },
        });
    }
}
