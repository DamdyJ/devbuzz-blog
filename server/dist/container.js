"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const client_1 = require("@prisma/client");
const auth_controller_1 = __importDefault(require("./controllers/auth.controller"));
const auth_service_1 = __importDefault(require("./services/auth.service"));
const jsonWebToken_utils_1 = __importDefault(require("./utils/jsonWebToken.utils"));
const encryption_utils_1 = __importDefault(require("./utils/encryption.utils"));
const user_service_1 = __importDefault(require("./services/user.service"));
const session_service_1 = __importDefault(require("./services/session.service"));
const article_controller_1 = __importDefault(require("./controllers/article.controller"));
const article_service_1 = __importDefault(require("./services/article.service"));
const profile_service_1 = __importDefault(require("./services/profile.service"));
const user_controller_1 = __importDefault(require("./controllers/user.controller"));
const profile_controller_1 = __importDefault(require("./controllers/profile.controller"));
const tag_service_1 = __importDefault(require("./services/tag.service"));
const tag_controller_1 = __importDefault(require("./controllers/tag.controller"));
const comment_controller_1 = __importDefault(require("./controllers/comment.controller"));
const comment_service_1 = __importDefault(require("./services/comment.service"));
const container = new inversify_1.Container();
// Service
container.bind(auth_service_1.default).toSelf();
container.bind(user_service_1.default).toSelf();
container.bind(session_service_1.default).toSelf();
container.bind(article_service_1.default).toSelf();
container.bind(profile_service_1.default).toSelf();
container.bind(tag_service_1.default).toSelf();
container.bind(comment_service_1.default).toSelf();
// Controller
container.bind(auth_controller_1.default).toSelf();
container.bind(article_controller_1.default).toSelf();
container.bind(user_controller_1.default).toSelf();
container.bind(profile_controller_1.default).toSelf();
container.bind(tag_controller_1.default).toSelf();
container.bind(comment_controller_1.default).toSelf();
container
    .bind("PrismaClient")
    .toConstantValue(new client_1.PrismaClient());
container.bind(jsonWebToken_utils_1.default).toSelf();
container.bind(encryption_utils_1.default).toSelf();
exports.default = container;
//# sourceMappingURL=container.js.map