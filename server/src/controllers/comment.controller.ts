import { Request, Response } from "express";
import { controller, httpGet, httpPost } from "inversify-express-utils";
import { inject } from "inversify";
import { HttpStatusCodeEnum } from "../enums/httpStatusCode.enum";
import CommentService from "../services/comment.service";
import { ErrorMessageEnum } from "../enums/errorMessage.enum";
import JsonWebTokenUtil from "../utils/jsonWebToken.utils";
import ArticleService from "../services/article.service";

@controller("/comment")
export default class CommentController {
    constructor(
        @inject(CommentService) private readonly commentService: CommentService,
        @inject(ArticleService)
        private readonly articleService: ArticleService,
        @inject(JsonWebTokenUtil)
        private readonly jsonWebTokenUtil: JsonWebTokenUtil
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
            return res.status(200).json(comments);
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
            return res
                .status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR)
                .json({
                    error,
                    message: ErrorMessageEnum.INTERNAL_SERVER_ERROR,
                });
        }
    }
}
