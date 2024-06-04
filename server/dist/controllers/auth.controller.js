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
const auth_service_1 = __importDefault(require("../services/auth.service"));
const errorMessage_enum_1 = require("../enums/errorMessage.enum");
const inversify_express_utils_1 = require("inversify-express-utils");
const httpStatusCode_enum_1 = require("../enums/httpStatusCode.enum");
const jsonWebToken_utils_1 = __importDefault(require("../utils/jsonWebToken.utils"));
const encryption_utils_1 = __importDefault(require("../utils/encryption.utils"));
const expiresIn_enum_1 = require("../enums/expiresIn.enum");
const successMessage_enum_1 = require("../enums/successMessage.enum");
const user_service_1 = __importDefault(require("../services/user.service"));
const session_service_1 = __importDefault(require("../services/session.service"));
const profile_service_1 = __importDefault(require("../services/profile.service"));
const randomProfile_utils_1 = require("../utils/randomProfile.utils");
const constants_1 = require("../constants");
const inversify_1 = require("inversify");
let AuthController = class AuthController {
    authService;
    userService;
    sessionService;
    profileService;
    jsonWebTokenUtil;
    encryptionUtil;
    constructor(authService, userService, sessionService, profileService, jsonWebTokenUtil, encryptionUtil) {
        this.authService = authService;
        this.userService = userService;
        this.sessionService = sessionService;
        this.profileService = profileService;
        this.jsonWebTokenUtil = jsonWebTokenUtil;
        this.encryptionUtil = encryptionUtil;
    }
    async signin(req, res) {
        try {
            const { email, password } = req.body;
            const hasEmail = await this.userService.findUserByEmail(email);
            if (!hasEmail) {
                return res.status(httpStatusCode_enum_1.HttpStatusCodeEnum.NOT_FOUND).json({
                    error: errorMessage_enum_1.ErrorMessageEnum.NOT_FOUND,
                    message: "Email has not been found",
                });
            }
            const user = hasEmail;
            const login = await this.encryptionUtil.hashValidation(password, user.password);
            if (!login) {
                return res.status(httpStatusCode_enum_1.HttpStatusCodeEnum.UNAUTHORIZED).json({
                    error: errorMessage_enum_1.ErrorMessageEnum.UNAUTHORIZED,
                    message: errorMessage_enum_1.ErrorMessageEnum.WRONG_PASSWORD,
                });
            }
            const accessToken = this.jsonWebTokenUtil.createAccessToken({ id: user.id }, expiresIn_enum_1.ExpiresInEnum.ONE_HOUR);
            const refreshToken = this.jsonWebTokenUtil.createRefreshToken({ id: user.id }, expiresIn_enum_1.ExpiresInEnum.ONE_WEEK);
            const expiredDate = this.jsonWebTokenUtil.getExpirationDate(refreshToken);
            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                maxAge: 60 * 60 * 1000,
            });
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            const session = await this.sessionService.findSessionByUserId(user.id);
            if (!session) {
                await this.sessionService.create(user.id, refreshToken, expiredDate);
                return res.status(httpStatusCode_enum_1.HttpStatusCodeEnum.OK).json({
                    message: "Login Succesfully",
                    accessToken,
                    refreshToken,
                });
            }
            await this.sessionService.update(user.id, refreshToken, expiredDate);
            return res.status(httpStatusCode_enum_1.HttpStatusCodeEnum.OK).json({
                message: "Login Succesfully",
                accessToken,
                refreshToken,
            });
        }
        catch (error) {
            return res
                .status(httpStatusCode_enum_1.HttpStatusCodeEnum.BAD_REQUEST)
                .json({ error, message: errorMessage_enum_1.ErrorMessageEnum.BAD_REQUEST });
        }
    }
    async signup(req, res) {
        try {
            const { username, email, password } = req.body;
            const hasEmail = await this.userService.findUserByEmail(email);
            if (hasEmail) {
                return res.status(httpStatusCode_enum_1.HttpStatusCodeEnum.CONFLICT).json({
                    error: errorMessage_enum_1.ErrorMessageEnum.CONFLICT,
                    message: "Email has already been registered",
                });
            }
            const hasUsername = await this.userService.findUserByUsername(username);
            if (hasUsername) {
                return res.status(httpStatusCode_enum_1.HttpStatusCodeEnum.CONFLICT).json({
                    error: errorMessage_enum_1.ErrorMessageEnum.CONFLICT,
                    message: "Username has already been taken",
                });
            }
            const hashPassword = await this.encryptionUtil.hashing(password);
            const newUser = await this.userService.create(username, email, hashPassword);
            await this.profileService.create(newUser.id, constants_1.PROFILE.BIO, randomProfile_utils_1.defaultProfile);
            const accessToken = this.jsonWebTokenUtil.createAccessToken({ id: newUser.id }, expiresIn_enum_1.ExpiresInEnum.ONE_HOUR);
            const refreshToken = this.jsonWebTokenUtil.createRefreshToken({ id: newUser.id }, expiresIn_enum_1.ExpiresInEnum.ONE_WEEK);
            const expiredDate = this.jsonWebTokenUtil.getExpirationDate(refreshToken);
            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                maxAge: 60 * 60 * 1000,
            });
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            await this.sessionService.create(newUser.id, refreshToken, expiredDate);
            return res.status(httpStatusCode_enum_1.HttpStatusCodeEnum.OK).json({
                User: newUser,
                accessToken,
                refreshToken,
            });
        }
        catch (error) {
            return res
                .status(httpStatusCode_enum_1.HttpStatusCodeEnum.BAD_REQUEST)
                .json({ error, message: errorMessage_enum_1.ErrorMessageEnum.BAD_REQUEST });
        }
    }
    async logout(req, res) {
        try {
            res.clearCookie("refreshToken");
            res.clearCookie("accessToken");
            return res
                .status(httpStatusCode_enum_1.HttpStatusCodeEnum.OK)
                .json({ message: "Logout" });
        }
        catch (error) {
            return res.status(httpStatusCode_enum_1.HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
                error,
                message: errorMessage_enum_1.ErrorMessageEnum.INTERNAL_SERVER_ERROR,
            });
        }
    }
    async checkCurrentUser(req, res) {
        try {
            const accessToken = req.cookies.accessToken;
            const refreshToken = req.cookies.refreshToken;
            console.log(refreshToken);
            if (!refreshToken && !accessToken) {
                return res
                    .status(httpStatusCode_enum_1.HttpStatusCodeEnum.FORBIDDEN)
                    .json({ message: errorMessage_enum_1.ErrorMessageEnum.FORBIDDEN });
            }
            const decode = this.jsonWebTokenUtil.decodeTokenAndGetId(refreshToken);
            const user = await this.userService.findUserById(decode.id);
            return res
                .status(httpStatusCode_enum_1.HttpStatusCodeEnum.OK)
                .json({ id: decode.id, user: { username: user?.username } });
        }
        catch (error) {
            return res
                .status(httpStatusCode_enum_1.HttpStatusCodeEnum.UNAUTHORIZED)
                .json({ error, message: errorMessage_enum_1.ErrorMessageEnum.UNAUTHORIZED });
        }
    }
    async getNewAccessToken(req, res) {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                return res.status(httpStatusCode_enum_1.HttpStatusCodeEnum.UNAUTHORIZED).json({
                    error: errorMessage_enum_1.ErrorMessageEnum.UNAUTHORIZED,
                    message: "Refresh token is missing",
                });
            }
            const hasExpired = this.jsonWebTokenUtil.expiredChecker(refreshToken);
            if (hasExpired) {
                return res.status(httpStatusCode_enum_1.HttpStatusCodeEnum.UNAUTHORIZED).json({
                    error: errorMessage_enum_1.ErrorMessageEnum.UNAUTHORIZED,
                    message: "RefreshToken already expired",
                });
            }
            const session = await this.sessionService.findSessionByRefreshToken(refreshToken);
            if (!session && !hasExpired) {
                return res.status(httpStatusCode_enum_1.HttpStatusCodeEnum.NOT_FOUND).json({
                    error: errorMessage_enum_1.ErrorMessageEnum.NOT_FOUND,
                    message: "Session is not found",
                });
            }
            const accessToken = this.jsonWebTokenUtil.createAccessToken({ id: session?.user_id }, expiresIn_enum_1.ExpiresInEnum.ONE_HOUR);
            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                maxAge: 60 * 60 * 1000,
            });
            return res.status(httpStatusCode_enum_1.HttpStatusCodeEnum.OK).json({
                accessToken,
            });
        }
        catch (error) {
            return res
                .status(httpStatusCode_enum_1.HttpStatusCodeEnum.BAD_REQUEST)
                .json({ error, message: errorMessage_enum_1.ErrorMessageEnum.BAD_REQUEST });
        }
    }
    verifyToken(req, res) {
        try {
            const accessToken = req.cookies.accessToken;
            if (!accessToken) {
                return res
                    .status(httpStatusCode_enum_1.HttpStatusCodeEnum.NOT_FOUND)
                    .json({ error: errorMessage_enum_1.ErrorMessageEnum.NOT_FOUND });
            }
            const verifyToken = this.jsonWebTokenUtil.verifyToken(accessToken);
            if (!verifyToken) {
                return res
                    .status(httpStatusCode_enum_1.HttpStatusCodeEnum.UNAUTHORIZED)
                    .json({ error: errorMessage_enum_1.ErrorMessageEnum.UNAUTHORIZED });
            }
            return res
                .status(httpStatusCode_enum_1.HttpStatusCodeEnum.OK)
                .json({ message: successMessage_enum_1.SuccessMessageEnum.ACCESS_GRANTED });
        }
        catch (error) {
            return res
                .status(httpStatusCode_enum_1.HttpStatusCodeEnum.BAD_REQUEST)
                .json({ error, message: errorMessage_enum_1.ErrorMessageEnum.BAD_REQUEST });
        }
    }
};
__decorate([
    (0, inversify_express_utils_1.httpPost)("/signin"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signin", null);
__decorate([
    (0, inversify_express_utils_1.httpPost)("/signup"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signup", null);
__decorate([
    (0, inversify_express_utils_1.httpGet)("/logout"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, inversify_express_utils_1.httpGet)("/check"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "checkCurrentUser", null);
__decorate([
    (0, inversify_express_utils_1.httpGet)("/refresh-token"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getNewAccessToken", null);
__decorate([
    (0, inversify_express_utils_1.httpGet)("/verify-token"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "verifyToken", null);
AuthController = __decorate([
    (0, inversify_express_utils_1.controller)("/auth"),
    __param(0, (0, inversify_1.inject)(auth_service_1.default)),
    __param(1, (0, inversify_1.inject)(user_service_1.default)),
    __param(2, (0, inversify_1.inject)(session_service_1.default)),
    __param(3, (0, inversify_1.inject)(profile_service_1.default)),
    __param(4, (0, inversify_1.inject)(jsonWebToken_utils_1.default)),
    __param(5, (0, inversify_1.inject)(encryption_utils_1.default)),
    __metadata("design:paramtypes", [auth_service_1.default,
        user_service_1.default,
        session_service_1.default,
        profile_service_1.default,
        jsonWebToken_utils_1.default,
        encryption_utils_1.default])
], AuthController);
exports.default = AuthController;
//# sourceMappingURL=auth.controller.js.map