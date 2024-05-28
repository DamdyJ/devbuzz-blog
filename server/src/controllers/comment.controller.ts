import { Request, Response } from "express";
import { controller, httpGet, httpPost } from "inversify-express-utils";
import { inject } from "inversify";
import { HttpStatusCodeEnum } from "../enums/httpStatusCode.enum";
import CommentService from "../services/comment.service";
import { ErrorMessageEnum } from "../enums/errorMessage.enum";
import JsonWebTokenUtil from "../utils/jsonWebToken.utils";
import ArticleService from "../services/article.service";
import UserService from "../services/user.service";
import ProfileService from "../services/profile.service";

@controller("/comment")
export default class CommentController {
    constructor(
        private readonly commentService: CommentService,
        private readonly articleService: ArticleService,
        private readonly jsonWebTokenUtil: JsonWebTokenUtil,
        private readonly userService: UserService,
        private readonly profileService: ProfileService
    ) {}

    @httpGet("/")
    public async getAllComments(req: Request, res: Response) {
        try {
            const comments = await this.commentService.findAllComments();
            if (comments.length == 0) {
                return res.status(HttpStatusCodeEnum.NOT_FOUND).json({
                    error: ErrorMessageEnum.NOT_FOUND,
                    message: "Comment is empty",
                });
            }

            return res.status(HttpStatusCodeEnum.OK).json(comments);
        } catch (error) {
            return res.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
                error,
                message: ErrorMessageEnum.INTERNAL_SERVER_ERROR,
            });
        }
    }

    @httpGet("/:id")
    public async getCommentById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const comments = await this.commentService.findCommentByArticleId(
                id
            );
            if (!comments.length) {
                return res
                    .status(HttpStatusCodeEnum.NOT_FOUND)
                    .json({ message: ErrorMessageEnum.NOT_FOUND });
            }

            const commentsWithProfileImages = await Promise.all(
                comments.map(async (comment) => {
                    const user = await this.userService.findUserById(
                        comment.user_id
                    );
                    const profile = await this.profileService.findProfileById(
                        comment.user_id
                    );
                    return {
                        id: comment.id,
                        user_id: user?.username || "Unknown",
                        comment: comment.comment,
                        created_at: comment.created_at,
                        profileImage: profile?.profile_image,
                    };
                })
            );

            return res
                .status(HttpStatusCodeEnum.OK)
                .json(commentsWithProfileImages);
        } catch (error) {
            return res.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
                error,
                message: ErrorMessageEnum.INTERNAL_SERVER_ERROR,
            });
        }
    }

    @httpPost("/")
    public async createComment(req: Request, res: Response) {
        try {
            const { articleId, comment } = req.body;

            const accessToken = req.cookies.accessToken;

            const findArticle = await this.articleService.findArticleById(
                articleId
            );

            if (!findArticle) {
                return res
                    .status(HttpStatusCodeEnum.NOT_FOUND)
                    .json({ error: ErrorMessageEnum.NOT_FOUND });
            }

            // verifty cookie
            if (!accessToken) {
                return res
                    .status(HttpStatusCodeEnum.NOT_FOUND)
                    .json({ message: "Token not found" });
            }
            // Verify the token
            const veriftyToken = this.jsonWebTokenUtil.verifyToken(accessToken);

            if (!veriftyToken) {
                return res
                    .status(HttpStatusCodeEnum.NOT_FOUND)
                    .json({ veriftyToken, message: "Not valid Token" });
            }

            const userId = this.jsonWebTokenUtil.decodeToken(accessToken);

            const createComment = await this.commentService.create(
                userId,
                articleId,
                comment
            );

            return res.status(HttpStatusCodeEnum.CREATED).json(createComment);
        } catch (error) {
            console.log(error);
            return res.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
                error,
                message: ErrorMessageEnum.INTERNAL_SERVER_ERROR,
            });
        }
    }
}
