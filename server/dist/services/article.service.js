"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const inversify_1 = require("inversify");
let ArticleService = class ArticleService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    /**
     *
     * @param userId
     * @param title
     * @param tagId
     * @param thumbnail
     * @param content
     * @returns
     */
    async create(userId, title, tagId, thumbnail, content) {
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
    async findAllArticles() {
        return await this.prisma.article.findMany();
    }
    async findArticleById(id) {
        return await this.prisma.article.findUnique({ where: { id } });
    }
    async delete(id) {
        return await this.prisma.article.delete({ where: { id } });
    }
    async findArticleByAuthor(authorId) {
        return await this.prisma.article.findFirst({
            where: { user_id: authorId },
        });
    }
    async findArticleByTitle(search) {
        return await this.prisma.article.findMany({
            where: {
                title: {
                    contains: search,
                },
            },
        });
    }
    async editArticle(id, title, tagId, thumbnail, content) {
        return await this.prisma.article.update({
            where: { id },
            data: { title, tag_id: tagId, thumbnail, content },
        });
    }
};
ArticleService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)("PrismaClient")),
    __metadata("design:paramtypes", [client_1.PrismaClient])
], ArticleService);
exports.default = ArticleService;
//# sourceMappingURL=article.service.js.map