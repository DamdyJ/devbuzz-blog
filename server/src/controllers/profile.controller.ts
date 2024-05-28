import { Request, Response } from "express";
import { controller, httpGet, httpPost } from "inversify-express-utils";
import ProfileService from "../services/profile.service";
import { ErrorMessageEnum } from "../enums/errorMessage.enum";
import { HttpStatusCodeEnum } from "../enums/httpStatusCode.enum";
import UserService from "../services/user.service";
import { upload } from "../middlewares/multer.middleware";
import JsonWebTokenUtil from "../utils/jsonWebToken.utils";

@controller("/profile")
export default class ProfileController {
    constructor(
        private readonly profileService: ProfileService,
        private readonly userService: UserService,
        private readonly jsonWebTokenUtil: JsonWebTokenUtil
    ) {}

    @httpGet("/profile-image")
    public async getProfileImage(req: Request, res: Response) {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                return res.status(HttpStatusCodeEnum.UNAUTHORIZED).json({
                    error: ErrorMessageEnum.UNAUTHORIZED,
                    message: "Uanutorized user",
                });
            }
            const decode =
                this.jsonWebTokenUtil.decodeTokenAndGetId(refreshToken);
            const profile = await this.profileService.findProfileById(
                decode.id
            );
            if (!profile) {
                return res.status(HttpStatusCodeEnum.NOT_FOUND).json({
                    error: ErrorMessageEnum.NOT_FOUND,
                    message: "Profile is not found",
                });
            }
            const user = await this.userService.findUserById(profile?.user_id);
            return res
                .status(HttpStatusCodeEnum.OK)
                .json({
                    profileImage: profile.profile_image,
                    username: user?.username,
                });
        } catch (error) {
            return res
                .status(HttpStatusCodeEnum.BAD_REQUEST)
                .json({ error, message: ErrorMessageEnum.BAD_REQUEST });
        }
    }

    @httpGet("/:username")
    public async getProfile(req: Request, res: Response) {
        try {
            const { username } = req.params;

            const user = await this.userService.findUserByUsername(username);
            if (!user) {
                return res.status(HttpStatusCodeEnum.NOT_FOUND).json({
                    error: ErrorMessageEnum.NOT_FOUND,
                    message: "User is not found",
                });
            }

            const profile = await this.profileService.findProfileById(user?.id);
            if (!profile) {
                return res
                    .status(HttpStatusCodeEnum.NOT_FOUND)
                    .json({ message: ErrorMessageEnum.NOT_FOUND });
            }

            return res.status(HttpStatusCodeEnum.OK).json({
                profile,
                user: {
                    userId: user.id,
                    email: user.email,
                    username: user.username,
                },
            });
        } catch (error) {
            return res
                .status(HttpStatusCodeEnum.BAD_REQUEST)
                .json({ error, message: ErrorMessageEnum.BAD_REQUEST });
        }
    }

    @httpPost("/:username", upload.single("image"))
    public async updateProfile(req: Request, res: Response) {
        try {
            const { username } = req.params;
            const { bio } = req.body;
            const image = req.file;

            const user = await this.userService.findUserByUsername(username);
            if (!user) {
                return res.status(HttpStatusCodeEnum.NOT_FOUND).json({
                    error: ErrorMessageEnum.NOT_FOUND,
                    message: "User is not found",
                });
            }

            const profile = await this.profileService.findProfileById(user?.id);
            if (!profile) {
                return res.status(HttpStatusCodeEnum.NOT_FOUND).json({
                    error: ErrorMessageEnum.NOT_FOUND,
                    message: "User profile is not found",
                });
            }

            if (!image) {
                const updatedProfile = await this.profileService.update(
                    user.id,
                    bio,
                    profile.profile_image
                );
                return res.status(HttpStatusCodeEnum.OK).json({
                    profile: updatedProfile,
                    user: { email: user.email },
                });
            }

            const updatedProfile = await this.profileService.update(
                user.id,
                bio,
                image.path
            );
            return res
                .status(HttpStatusCodeEnum.OK)
                .json({ profile: updatedProfile, user: { email: user.email } });
        } catch (error) {
            return res
                .status(HttpStatusCodeEnum.BAD_REQUEST)
                .json({ error, message: ErrorMessageEnum.BAD_REQUEST });
        }
    }
}
