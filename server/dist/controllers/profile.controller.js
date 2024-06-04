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
const profile_service_1 = __importDefault(require("../services/profile.service"));
const errorMessage_enum_1 = require("../enums/errorMessage.enum");
const httpStatusCode_enum_1 = require("../enums/httpStatusCode.enum");
const user_service_1 = __importDefault(require("../services/user.service"));
const multer_middleware_1 = require("../middlewares/multer.middleware");
const jsonWebToken_utils_1 = __importDefault(require("../utils/jsonWebToken.utils"));
let ProfileController = class ProfileController {
    profileService;
    userService;
    jsonWebTokenUtil;
    constructor(profileService, userService, jsonWebTokenUtil) {
        this.profileService = profileService;
        this.userService = userService;
        this.jsonWebTokenUtil = jsonWebTokenUtil;
    }
    async getProfileImage(req, res) {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                return res.status(httpStatusCode_enum_1.HttpStatusCodeEnum.UNAUTHORIZED).json({
                    error: errorMessage_enum_1.ErrorMessageEnum.UNAUTHORIZED,
                    message: "Uanutorized user",
                });
            }
            const decode = this.jsonWebTokenUtil.decodeTokenAndGetId(refreshToken);
            const profile = await this.profileService.findProfileById(decode.id);
            if (!profile) {
                return res.status(httpStatusCode_enum_1.HttpStatusCodeEnum.NOT_FOUND).json({
                    error: errorMessage_enum_1.ErrorMessageEnum.NOT_FOUND,
                    message: "Profile is not found",
                });
            }
            const user = await this.userService.findUserById(profile?.user_id);
            return res
                .status(httpStatusCode_enum_1.HttpStatusCodeEnum.OK)
                .json({
                profileImage: profile.profile_image,
                username: user?.username,
            });
        }
        catch (error) {
            return res
                .status(httpStatusCode_enum_1.HttpStatusCodeEnum.BAD_REQUEST)
                .json({ error, message: errorMessage_enum_1.ErrorMessageEnum.BAD_REQUEST });
        }
    }
    async getProfile(req, res) {
        try {
            const { username } = req.params;
            const user = await this.userService.findUserByUsername(username);
            if (!user) {
                return res.status(httpStatusCode_enum_1.HttpStatusCodeEnum.NOT_FOUND).json({
                    error: errorMessage_enum_1.ErrorMessageEnum.NOT_FOUND,
                    message: "User is not found",
                });
            }
            const profile = await this.profileService.findProfileById(user?.id);
            if (!profile) {
                return res
                    .status(httpStatusCode_enum_1.HttpStatusCodeEnum.NOT_FOUND)
                    .json({ message: errorMessage_enum_1.ErrorMessageEnum.NOT_FOUND });
            }
            return res.status(httpStatusCode_enum_1.HttpStatusCodeEnum.OK).json({
                profile,
                user: {
                    userId: user.id,
                    email: user.email,
                    username: user.username,
                },
            });
        }
        catch (error) {
            return res
                .status(httpStatusCode_enum_1.HttpStatusCodeEnum.BAD_REQUEST)
                .json({ error, message: errorMessage_enum_1.ErrorMessageEnum.BAD_REQUEST });
        }
    }
    async updateProfile(req, res) {
        try {
            const { username } = req.params;
            const { bio } = req.body;
            const image = req.file;
            const user = await this.userService.findUserByUsername(username);
            if (!user) {
                return res.status(httpStatusCode_enum_1.HttpStatusCodeEnum.NOT_FOUND).json({
                    error: errorMessage_enum_1.ErrorMessageEnum.NOT_FOUND,
                    message: "User is not found",
                });
            }
            const profile = await this.profileService.findProfileById(user?.id);
            if (!profile) {
                return res.status(httpStatusCode_enum_1.HttpStatusCodeEnum.NOT_FOUND).json({
                    error: errorMessage_enum_1.ErrorMessageEnum.NOT_FOUND,
                    message: "User profile is not found",
                });
            }
            if (!image) {
                const updatedProfile = await this.profileService.update(user.id, bio, profile.profile_image);
                return res.status(httpStatusCode_enum_1.HttpStatusCodeEnum.OK).json({
                    profile: updatedProfile,
                    user: { email: user.email },
                });
            }
            const updatedProfile = await this.profileService.update(user.id, bio, image.path);
            return res
                .status(httpStatusCode_enum_1.HttpStatusCodeEnum.OK)
                .json({ profile: updatedProfile, user: { email: user.email } });
        }
        catch (error) {
            return res
                .status(httpStatusCode_enum_1.HttpStatusCodeEnum.BAD_REQUEST)
                .json({ error, message: errorMessage_enum_1.ErrorMessageEnum.BAD_REQUEST });
        }
    }
};
__decorate([
    (0, inversify_express_utils_1.httpGet)("/profile-image"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "getProfileImage", null);
__decorate([
    (0, inversify_express_utils_1.httpGet)("/:username"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "getProfile", null);
__decorate([
    (0, inversify_express_utils_1.httpPost)("/:username", multer_middleware_1.upload.single("image")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "updateProfile", null);
ProfileController = __decorate([
    (0, inversify_express_utils_1.controller)("/profile"),
    __metadata("design:paramtypes", [profile_service_1.default,
        user_service_1.default,
        jsonWebToken_utils_1.default])
], ProfileController);
exports.default = ProfileController;
//# sourceMappingURL=profile.controller.js.map