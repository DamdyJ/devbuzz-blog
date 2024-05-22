import { Container } from "inversify";
import { PrismaClient } from "@prisma/client";
import AuthController from "./controllers/auth.controller";
import AuthService from "./services/auth.service";
import JsonWebTokenUtil from "./utils/jsonWebToken.utils";
import EncryptionUtil from "./utils/encryption.utils";
import UserService from "./services/user.service";
import SessionService from "./services/session.service";
import ArticleController from "./controllers/article.controller";
import ArticleService from "./services/article.service";
import ProfileService from "./services/profile.service";
import UserController from "./controllers/user.controller";
import ProfileController from "./controllers/profile.controller";
import TagService from "./services/tag.service";
import TagController from "./controllers/tag.controller";
import CommentController from "./controllers/comment.controller";
import CommentService from "./services/comment.service";

const container = new Container();

// Service
container.bind<AuthService>(AuthService).toSelf();
container.bind<UserService>(UserService).toSelf();
container.bind<SessionService>(SessionService).toSelf();
container.bind<ArticleService>(ArticleService).toSelf();
container.bind<ProfileService>(ProfileService).toSelf();
container.bind<TagService>(TagService).toSelf();
container.bind<CommentService>(CommentService).toSelf();

// Controller
container.bind<AuthController>(AuthController).toSelf();
container.bind<ArticleController>(ArticleController).toSelf();
container.bind<UserController>(UserController).toSelf();
container.bind<ProfileController>(ProfileController).toSelf();
container.bind<TagController>(TagController).toSelf();
container.bind<CommentController>(CommentController).toSelf();

container
    .bind<PrismaClient>("PrismaClient")
    .toConstantValue(new PrismaClient());
container.bind<JsonWebTokenUtil>(JsonWebTokenUtil).toSelf();
container.bind<EncryptionUtil>(EncryptionUtil).toSelf();

export default container;
