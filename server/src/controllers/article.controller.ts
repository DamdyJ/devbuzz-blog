import { Request, Response } from "express";
import {
    controller,
    httpDelete,
    httpGet,
    httpPost,
    queryParam,
    response,
} from "inversify-express-utils";
import { HttpStatusCodeEnum } from "../enums/httpStatusCode.enum";
import { ErrorMessageEnum } from "../enums/errorMessage.enum";
import ArticleService from "../services/article.service";
import SessionService from "../services/session.service";
import { upload } from "../middlewares/multer.middleware";
import { inject } from "inversify";
import JsonWebTokenUtil from "../utils/jsonWebToken.utils";
import TagService from "../services/tag.service";
import UserService from "../services/user.service";
import AuthenticateToken from "../middlewares/auth.middleware";

interface IRequest extends Request {
    user?: { id: string };
}

@controller("/article")
export default class ArticleController {
    constructor(
        @inject(ArticleService) private readonly articleService: ArticleService,
        @inject(SessionService) private readonly sessionService: SessionService,
        @inject(JsonWebTokenUtil)
        private readonly jsonWebTokenUtil: JsonWebTokenUtil,
        @inject(TagService) private readonly tagService: TagService,
        @inject(UserService) private readonly userService: UserService
    ) {}
    @httpGet("/")
    public async getAllArticles(req: Request, res: Response) {
        try {
            const { page, limit } = req.query;
            const pageNumber = parseInt(page as string) || 1;
            const limitNumber = parseInt(limit as string) || 10;

            const articles = await this.articleService.findAllArticles();

            if (pageNumber <= 0 || limitNumber <= 0) {
                return res
                    .status(400)
                    .json({ message: "Invalid page or limit value" });
            }

            const startIndex = (pageNumber - 1) * limitNumber;
            const endIndex = pageNumber * limitNumber;
            const paginatedArticles = articles.slice(startIndex, endIndex);

            const formattedArticles = await Promise.all(
                paginatedArticles.map(async (article) => {
                    const tag = await this.tagService.findTagbyId(
                        article.tag_id
                    );
                    const username = await this.userService.findUserById(
                        article.user_id
                    );
                    return {
                        ...article,
                        tag: tag?.name,
                        username: username?.username,
                    };
                })
            );

            return res.status(HttpStatusCodeEnum.OK).json({
                total: articles.length,
                articles: formattedArticles,
                page: pageNumber,
                limit: limitNumber,
            });
        } catch (error) {
            return res.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
                error,
                message: ErrorMessageEnum.INTERNAL_SERVER_ERROR,
            });
        }
    }

    @httpGet("/v1/test")
    public async testGetArticles(
        @queryParam("page") page: number,
        @queryParam("limit") limit: number,
        @response() res: Response
    ) {
        try {
            const pageNumber = page || 1;
            const limitNumber = limit || 10;

            const articles = await this.articleService.findAllArticles();

            if (pageNumber <= 0 || limitNumber <= 0) {
                return res
                    .status(400)
                    .json({ message: "Invalid page or limit value" });
            }

            const startIndex = (pageNumber - 1) * limitNumber;
            const endIndex = pageNumber * limitNumber;
            const paginatedArticles = articles.slice(startIndex, endIndex);

            res.setHeader("Cache-Control", "public, max-age=3600");

            return res.status(HttpStatusCodeEnum.OK).json({
                total: articles.length,
                articles: paginatedArticles,
                page: pageNumber,
                limit: limitNumber,
            });
        } catch (error) {
            return res.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
                error,
                message: ErrorMessageEnum.INTERNAL_SERVER_ERROR,
            });
        }
    }

    @httpGet("/test/")
    public async getArticleByTitle(
        @queryParam("search") search: string,
        req: Request,
        res: Response
    ) {
        try {
            const article = await this.articleService.findArticleByTitle(
                search
            );
            console.log(article);
            return res.status(HttpStatusCodeEnum.OK).json(article);
        } catch (error) {
            return res
                .status(HttpStatusCodeEnum.BAD_REQUEST)
                .json({ error, message: ErrorMessageEnum.BAD_REQUEST });
        }
    }

    @httpGet("/:id", AuthenticateToken)
    public async getArticleById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const article = await this.articleService.findArticleById(id);
            if (!article) {
                return res.status(HttpStatusCodeEnum.NOT_FOUND).json({
                    error: ErrorMessageEnum.NOT_FOUND,
                    message: "Article is not found",
                });
            }
            const user = await this.userService.findUserById(article.user_id);
            const tag = await this.tagService.findTagbyId(article.tag_id);
            return res.status(HttpStatusCodeEnum.OK).json({
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
            });
        } catch (error) {
            return res
                .status(HttpStatusCodeEnum.BAD_REQUEST)
                .json({ error, message: ErrorMessageEnum.BAD_REQUEST });
        }
    }

    @httpPost("/create", upload.single("thumbnail"))
    public async createArticle(req: Request, res: Response) {
        try {
            const { title, tag, content } = req.body;
            const thumbnail = req.file?.path;
            // get cookie
            const accessToken = req.cookies.accessToken;
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

            const payload = this.jsonWebTokenUtil.decodeToken(accessToken);
            const tagId = await this.tagService.findTagbyName(tag);
            if (!tagId) {
                return res
                    .status(HttpStatusCodeEnum.NOT_FOUND)
                    .json({ message: ErrorMessageEnum.NOT_FOUND });
            }
            if (!thumbnail) {
                return res
                    .status(HttpStatusCodeEnum.BAD_REQUEST)
                    .json({ message: ErrorMessageEnum.BAD_REQUEST });
            }
            const article = await this.articleService.create(
                payload,
                title,
                tagId.id,
                thumbnail,
                content
            );

            return res.status(HttpStatusCodeEnum.OK).json({ article });
        } catch (error) {
            return res
                .status(HttpStatusCodeEnum.BAD_REQUEST)
                .json({ error, message: ErrorMessageEnum.BAD_REQUEST });
        }
    }

    @httpPost("/:id", AuthenticateToken, upload.single("thumbnail"))
    public async editArticle(req: IRequest, res: Response) {
        try {
            const { id } = req.params;
            let { title, tag, content } = req.body;
            let thumbnail = req.file?.path;

            const refreshToken = req.cookies.refreshToken;
            // verifty cookie
            if (!refreshToken) {
                return res
                    .status(HttpStatusCodeEnum.UNAUTHORIZED)
                    .json({ message: "Token not found" });
            }

            // Verify the token
            const veriftyToken =
                await this.sessionService.findSessionByRefreshToken(
                    refreshToken
                );

            if (!veriftyToken) {
                return res
                    .status(HttpStatusCodeEnum.UNAUTHORIZED)
                    .json({ veriftyToken, message: "Not valid Token" });
            }

            const getArticle = await this.articleService.findArticleById(id);
            if (!getArticle) {
                return res.status(HttpStatusCodeEnum.NOT_FOUND).json({
                    error: ErrorMessageEnum.NOT_FOUND,
                    message: "article is missing",
                });
            }

            if (req.user?.id !== getArticle.user_id) {
                return res.status(HttpStatusCodeEnum.FORBIDDEN).json({
                    error: ErrorMessageEnum.FORBIDDEN,
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
                return res.status(HttpStatusCodeEnum.NOT_FOUND).json({
                    error: ErrorMessageEnum.NOT_FOUND,
                    message: "Tag is missing",
                });
            }

            const article = await this.articleService.editArticle(
                id,
                title,
                tagId.id,
                thumbnail,
                content
            );
            return res.status(HttpStatusCodeEnum.OK).json({ article });
        } catch (error) {
            console.log(error);
            return res
                .status(HttpStatusCodeEnum.BAD_REQUEST)
                .json({ error, message: ErrorMessageEnum.BAD_REQUEST });
        }
    }

    @httpDelete("/:id")
    public async deleteArticleById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const article = await this.articleService.findArticleById(id);
            if (!article) {
                return res.status(HttpStatusCodeEnum.NOT_FOUND).json({
                    error: ErrorMessageEnum.NOT_FOUND,
                    mesage: "Article is not found",
                });
            }
            const deletedArticle = await this.articleService.delete(id);
            res.status(HttpStatusCodeEnum.OK).json({
                deletedArticle,
                message: "Article got deleted",
            });
        } catch (error) {
            return res
                .status(HttpStatusCodeEnum.BAD_REQUEST)
                .json({ error, message: ErrorMessageEnum.BAD_REQUEST });
        }
    }
}
