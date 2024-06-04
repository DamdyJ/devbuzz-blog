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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_express_utils_1 = require("inversify-express-utils");
const httpStatusCode_enum_1 = require("../enums/httpStatusCode.enum");
const comment_service_1 = __importDefault(require("../services/comment.service"));
const errorMessage_enum_1 = require("../enums/errorMessage.enum");
const jsonWebToken_utils_1 = __importDefault(require("../utils/jsonWebToken.utils"));
const article_service_1 = __importDefault(require("../services/article.service"));
const user_service_1 = __importDefault(require("../services/user.service"));
const profile_service_1 = __importDefault(require("../services/profile.service"));
let CommentController = class CommentController {
    commentService;
    articleService;
    jsonWebTokenUtil;
    userService;
    profileService;
    constructor(commentService, articleService, jsonWebTokenUtil, userService, profileService) {
        this.commentService = commentService;
        this.articleService = articleService;
        this.jsonWebTokenUtil = jsonWebTokenUtil;
        this.userService = userService;
        this.profileService = profileService;
    }
    async getAllComments(req, res) {
        try {
            const comments = await this.commentService.findAllComments();
            if (comments.length == 0) {
                return res.status(httpStatusCode_enum_1.HttpStatusCodeEnum.NOT_FOUND).json({
                    error: errorMessage_enum_1.ErrorMessageEnum.NOT_FOUND,
                    message: "Comment is empty",
                });
            }
            return res.status(httpStatusCode_enum_1.HttpStatusCodeEnum.OK).json(comments);
        }
        catch (error) {
            return res.status(httpStatusCode_enum_1.HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
                error,
                message: errorMessage_enum_1.ErrorMessageEnum.INTERNAL_SERVER_ERROR,
            });
        }
    }
    async getCommentById(req, res) {
        try {
            const { id } = req.params;
            const comments = await this.commentService.findCommentByArticleId(id);
            if (!comments.length) {
                return res
                    .status(httpStatusCode_enum_1.HttpStatusCodeEnum.NOT_FOUND)
                    .json({ message: errorMessage_enum_1.ErrorMessageEnum.NOT_FOUND });
            }
            const commentsWithProfileImages = await Promise.all(comments.map(async (comment) => {
                const user = await this.userService.findUserById(comment.user_id);
                const profile = await this.profileService.findProfileById(comment.user_id);
                return {
                    id: comment.id,
                    user_id: user?.username || "Unknown",
                    comment: comment.comment,
                    created_at: comment.created_at,
                    profileImage: profile?.profile_image,
                };
            }));
            return res
                .status(httpStatusCode_enum_1.HttpStatusCodeEnum.OK)
                .json(commentsWithProfileImages);
        }
        catch (error) {
            return res.status(httpStatusCode_enum_1.HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
                error,
                message: errorMessage_enum_1.ErrorMessageEnum.INTERNAL_SERVER_ERROR,
            });
        }
    }
    async createComment(req, res) {
        try {
            const { articleId, comment } = req.body;
            const accessToken = req.cookies.accessToken;
            const findArticle = await this.articleService.findArticleById(articleId);
            if (!findArticle) {
                return res
                    .status(httpStatusCode_enum_1.HttpStatusCodeEnum.NOT_FOUND)
                    .json({ error: errorMessage_enum_1.ErrorMessageEnum.NOT_FOUND });
            }
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
            const userId = this.jsonWebTokenUtil.decodeToken(accessToken);
            const createComment = await this.commentService.create(userId, articleId, comment);
            return res.status(httpStatusCode_enum_1.HttpStatusCodeEnum.CREATED).json(createComment);
        }
        catch (error) {
            console.log(error);
            return res.status(httpStatusCode_enum_1.HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
                error,
                message: errorMessage_enum_1.ErrorMessageEnum.INTERNAL_SERVER_ERROR,
            });
        }
    }
};
__decorate([
    (0, inversify_express_utils_1.httpGet)("/"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "getAllComments", null);
__decorate([
    (0, inversify_express_utils_1.httpGet)("/:id"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "getCommentById", null);
__decorate([
    (0, inversify_express_utils_1.httpPost)("/"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "createComment", null);
CommentController = __decorate([
    (0, inversify_express_utils_1.controller)("/comment"),
    __metadata("design:paramtypes", [comment_service_1.default,
        article_service_1.default,
        jsonWebToken_utils_1.default,
        user_service_1.default,
        profile_service_1.default])
], CommentController);
exports.default = CommentController;
//# sourceMappingURL=comment.controller.js.map