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
let CommentService = class CommentService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, articleId, comment) {
        return await this.prisma.comment.create({
            data: {
                user_id: userId,
                article_id: articleId,
                comment: comment,
            },
        });
    }
    async findAllComments() {
        return await this.prisma.comment.findMany();
    }
    async findCommentById(id) {
        return await this.prisma.comment.findUnique({ where: { id } });
    }
    async findCommentByArticleId(articleId) {
        return await this.prisma.comment.findMany({
            where: { article_id: articleId }
        });
    }
};
CommentService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)("PrismaClient")),
    __metadata("design:paramtypes", [client_1.PrismaClient])
], CommentService);
exports.default = CommentService;
//# sourceMappingURL=comment.service.js.map