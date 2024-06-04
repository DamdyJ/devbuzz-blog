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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_express_utils_1 = require("inversify-express-utils");
const httpStatusCode_enum_1 = require("../enums/httpStatusCode.enum");
const errorMessage_enum_1 = require("../enums/errorMessage.enum");
const article_service_1 = __importDefault(require("../services/article.service"));
const session_service_1 = __importDefault(require("../services/session.service"));
const multer_middleware_1 = require("../middlewares/multer.middleware");
const inversify_1 = require("inversify");
const jsonWebToken_utils_1 = __importDefault(require("../utils/jsonWebToken.utils"));
const tag_service_1 = __importDefault(require("../services/tag.service"));
const user_service_1 = __importDefault(require("../services/user.service"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
let ArticleController = class ArticleController {
    articleService;
    sessionService;
    jsonWebTokenUtil;
    tagService;
    userService;
    constructor(articleService, sessionService, jsonWebTokenUtil, tagService, userService) {
        this.articleService = articleService;
        this.sessionService = sessionService;
        this.jsonWebTokenUtil = jsonWebTokenUtil;
        this.tagService = tagService;
        this.userService = userService;
    }
    async getAllArticles(req, res) {
        try {
            const { page, limit, q } = req.query;
            const pageNumber = parseInt(page) || 1;
            const limitNumber = parseInt(limit) || 10;
            const searchTerm = q || "";
            let articles = await this.articleService.findAllArticles();
            if (pageNumber <= 0 || limitNumber <= 0) {
                return res
                    .status(400)
                    .json({ message: "Invalid page or limit value" });
            }
            const tagId = await this.tagService.findTagbyName(searchTerm);
            if (searchTerm.trim() !== "") {
                articles = articles.filter((article) => article.title
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                    article.tag_id == tagId?.id);
            }
            if (articles.length === 0) {
                return res
                    .status(httpStatusCode_enum_1.HttpStatusCodeEnum.NOT_FOUND)
                    .json({ message: "No articles found" });
            }
            articles = articles.sort((a, b) => new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime());
            const startIndex = (pageNumber - 1) * limitNumber;
            const endIndex = pageNumber * limitNumber;
            const paginatedArticles = articles.slice(startIndex, endIndex);
            const formattedArticles = await Promise.all(paginatedArticles.map(async (article) => {
                const tag = await this.tagService.findTagbyId(article.tag_id);
                const username = await this.userService.findUserById(article.user_id);
                return {
                    ...article,
                    tag: tag?.name,
                    username: username?.username,
                };
            }));
            return res.status(httpStatusCode_enum_1.HttpStatusCodeEnum.OK).json({
                total: articles.length,
                articles: formattedArticles,
                page: pageNumber,
                limit: limitNumber,
            });
        }
        catch (error) {
            return res.status(httpStatusCode_enum_1.HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
                error,
                message: errorMessage_enum_1.ErrorMessageEnum.INTERNAL_SERVER_ERROR,
            });
        }
    }
    async getArticleById(req, res) {
        try {
            const { id } = req.params;
            const article = await this.articleService.findArticleById(id);
            if (!article) {
                return res.status(httpStatusCode_enum_1.HttpStatusCodeEnum.NOT_FOUND).json({
                    error: errorMessage_enum_1.ErrorMessageEnum.NOT_FOUND,
                    message: "Article is not found",
                });
            }
            const user = await this.userService.findUserById(article.user_id);
            const tag = await this.tagService.findTagbyId(article.tag_id);
            return res.status(httpStatusCode_enum_1.HttpStatusCodeEnum.OK).json({
                article: {
                    id: article.id,
                    user: user?.username,
                    title: article.title,
                    tag: tag?.name,
                    thumbnail: article.thumbnail,
                    content: article.content,
                    createdAt: article.created_at,
                    updatedAt: article.updated_at,
                },
                user: {
                    id: user?.id,
                },
            });
        }
        catch (error) {
            return res
                .status(httpStatusCode_enum_1.HttpStatusCodeEnum.BAD_REQUEST)
                .json({ error, message: errorMessage_enum_1.ErrorMessageEnum.BAD_REQUEST });
        }
    }
    async createArticle(req, res) {
        try {
            const { title, tag, content } = req.body;
            const thumbnail = req.file?.path;
            // get cookie
            const accessToken = req.cookies.accessToken;
            // verifty cookie
            if (!accessToken) {
                return res
                    .status(httpStatusCode_enum_1.HttpStatusCodeEnum.NOT_FOUND)
                    .json({ message: "Token not found" });
            }
            // Verify the token
            const veriftyToken = this.jsonWebTokenUtil.verifyToken(accessToken);
            if (!veriftyToken) {
                return res
                    .status(httpStatusCode_enum_1.HttpStatusCodeEnum.NOT_FOUND)
                    .json({ veriftyToken, message: "Not valid Token" });
            }
            const payload = this.jsonWebTokenUtil.decodeToken(accessToken);
            const tagId = await this.tagService.findTagbyName(tag);
            if (!tagId) {
                return res
                    .status(httpStatusCode_enum_1.HttpStatusCodeEnum.NOT_FOUND)
                    .json({ message: errorMessage_enum_1.ErrorMessageEnum.NOT_FOUND });
            }
            if (!thumbnail) {
                return res
                    .status(httpStatusCode_enum_1.HttpStatusCodeEnum.BAD_REQUEST)
                    .json({ message: errorMessage_enum_1.ErrorMessageEnum.BAD_REQUEST });
            }
            const article = await this.articleService.create(payload, title, tagId.id, thumbnail, content);
            return res.status(httpStatusCode_enum_1.HttpStatusCodeEnum.OK).json({ article });
        }
        catch (error) {
            return res
                .status(httpStatusCode_enum_1.HttpStatusCodeEnum.BAD_REQUEST)
                .json({ error, message: errorMessage_enum_1.ErrorMessageEnum.BAD_REQUEST });
        }
    }
    async editArticle(req, res) {
        try {
            const { id } = req.params;
            let { title, tag, content } = req.body;
            let thumbnail = req.file?.path;
            const refreshToken = req.cookies.refreshToken;
            // verifty cookie
            if (!refreshToken) {
                return res
                    .status(httpStatusCode_enum_1.HttpStatusCodeEnum.UNAUTHORIZED)
                    .json({ message: "Token not found" });
            }
            // Verify the token
            const veriftyToken = await this.sessionService.findSessionByRefreshToken(refreshToken);
            if (!veriftyToken) {
                return res
                    .status(httpStatusCode_enum_1.HttpStatusCodeEnum.UNAUTHORIZED)
                    .json({ veriftyToken, message: "Not valid Token" });
            }
            const getArticle = await this.articleService.findArticleById(id);
            if (!getArticle) {
                return res.status(httpStatusCode_enum_1.HttpStatusCodeEnum.NOT_FOUND).json({
                    error: errorMessage_enum_1.ErrorMessageEnum.NOT_FOUND,
                    message: "article is missing",
                });
            }
            if (req.user?.id !== getArticle.user_id) {
                return res.status(httpStatusCode_enum_1.HttpStatusCodeEnum.FORBIDDEN).json({
                    error: errorMessage_enum_1.ErrorMessageEnum.FORBIDDEN,
                    message: "You are not authorized to edit this article",
                });
            }
            if (!title) {
                title = getArticle.title;
            }
            if (!tag) {
                const tagId = getArticle.tag_id;
                const getTag = await this.tagService.findTagbyId(tagId);
                tag = getTag?.name;
            }
            if (!content) {
                content = getArticle.content;
            }
            if (!thumbnail) {
                thumbnail = getArticle.thumbnail;
            }
            const tagId = await this.tagService.findTagbyName(tag);
            if (!tagId) {
                return res.status(httpStatusCode_enum_1.HttpStatusCodeEnum.NOT_FOUND).json({
                    error: errorMessage_enum_1.ErrorMessageEnum.NOT_FOUND,
                    message: "Tag is missing",
                });
            }
            const article = await this.articleService.editArticle(id, title, tagId.id, thumbnail, content);
            return res.status(httpStatusCode_enum_1.HttpStatusCodeEnum.OK).json({ article });
        }
        catch (error) {
            console.log(error);
            return res
                .status(httpStatusCode_enum_1.HttpStatusCodeEnum.BAD_REQUEST)
                .json({ error, message: errorMessage_enum_1.ErrorMessageEnum.BAD_REQUEST });
        }
    }
    async deleteArticleById(req, res) {
        try {
            const { id } = req.params;
            const article = await this.articleService.findArticleById(id);
            if (!article) {
                return res.status(httpStatusCode_enum_1.HttpStatusCodeEnum.NOT_FOUND).json({
                    error: errorMessage_enum_1.ErrorMessageEnum.NOT_FOUND,
                    mesage: "Article is not found",
                });
            }
            const deletedArticle = await this.articleService.delete(id);
            res.status(httpStatusCode_enum_1.HttpStatusCodeEnum.OK).json({
                deletedArticle,
                message: "Article got deleted",
            });
        }
        catch (error) {
            return res
                .status(httpStatusCode_enum_1.HttpStatusCodeEnum.BAD_REQUEST)
                .json({ error, message: errorMessage_enum_1.ErrorMessageEnum.BAD_REQUEST });
        }
    }
};
__decorate([
    (0, inversify_express_utils_1.httpGet)("/"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "getAllArticles", null);
__decorate([
    (0, inversify_express_utils_1.httpGet)("/:id", auth_middleware_1.default),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "getArticleById", null);
__decorate([
    (0, inversify_express_utils_1.httpPost)("/create", multer_middleware_1.upload.single("thumbnail")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "createArticle", null);
__decorate([
    (0, inversify_express_utils_1.httpPost)("/:id", auth_middleware_1.default, multer_middleware_1.upload.single("thumbnail")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "editArticle", null);
__decorate([
    (0, inversify_express_utils_1.httpDelete)("/:id"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "deleteArticleById", null);
ArticleController = __decorate([
    (0, inversify_express_utils_1.controller)("/article"),
    __param(0, (0, inversify_1.inject)(article_service_1.default)),
    __param(1, (0, inversify_1.inject)(session_service_1.default)),
    __param(2, (0, inversify_1.inject)(jsonWebToken_utils_1.default)),
    __param(3, (0, inversify_1.inject)(tag_service_1.default)),
    __param(4, (0, inversify_1.inject)(user_service_1.default)),
    __metadata("design:paramtypes", [article_service_1.default,
        session_service_1.default,
        jsonWebToken_utils_1.default,
        tag_service_1.default,
        user_service_1.default])
], ArticleController);
exports.default = ArticleController;
//# sourceMappingURL=article.controller.js.map