import { Request, Response } from "express";
import AuthService from "../services/auth.service";
import { ErrorMessageEnum } from "../enums/errorMessage.enum";
import { controller, httpGet, httpPost } from "inversify-express-utils";
import { HttpStatusCodeEnum } from "../enums/httpStatusCode.enum";
import JsonWebTokenUtil from "../utils/jsonWebToken.utils";
import EncryptionUtil from "../utils/encryption.utils";
import { ExpiresInEnum } from "../enums/expiresIn.enum";
import { authenticeToken } from "../middlewares/auth.middleware";
import { SuccessMessageEnum } from "../enums/successMessage.enum";
import UserService from "../services/user.service";
import SessionService from "../services/session.service";
import ProfileService from "../services/profile.service";
import { defaultProfile } from "../utils/randomProfile.utils";
import { PROFILE } from "../constants";
import { inject } from "inversify";
import { error } from "console";

@controller("/auth")
export default class AuthController {
    constructor(
        @inject(AuthService) private readonly authService: AuthService,
        @inject(UserService) private readonly userService: UserService,
        @inject(SessionService) private readonly sessionService: SessionService,
        @inject(ProfileService) private readonly profileService: ProfileService,
        @inject(JsonWebTokenUtil)
        private readonly jsonWebTokenUtil: JsonWebTokenUtil,
        @inject(EncryptionUtil) private readonly encryptionUtil: EncryptionUtil
    ) {}

    @httpPost("/signin")
    async signin(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            const hasEmail = await this.userService.findUserByEmail(email);
            if (!hasEmail) {
                return res.status(HttpStatusCodeEnum.NOT_FOUND).json({
                    error: ErrorMessageEnum.NOT_FOUND,
                    message: "Email has not been found",
                });
            }
            const user = hasEmail;

            const login = await this.encryptionUtil.hashValidation(
                password,
                user.password
            );
            if (!login) {
                return res.status(HttpStatusCodeEnum.UNAUTHORIZED).json({
                    error: ErrorMessageEnum.UNAUTHORIZED,
                    message: ErrorMessageEnum.WRONG_PASSWORD,
                });
            }
            const accessToken = this.jsonWebTokenUtil.createAccessToken(
                { id: user.id },
                ExpiresInEnum.ONE_HOUR
            );
            const refreshToken = this.jsonWebTokenUtil.createRefreshToken(
                { id: user.id },
                ExpiresInEnum.ONE_WEEK
            );
            const expiredDate =
                this.jsonWebTokenUtil.getExpirationDate(refreshToken);

            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                maxAge: 60 * 60 * 1000,
            });
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            const session = await this.sessionService.findSessionByUserId(
                user.id
            );
            if (!session) {
                await this.sessionService.create(
                    user.id,
                    refreshToken,
                    expiredDate
                );
                return res.status(HttpStatusCodeEnum.OK).json({
                    message: "Login Succesfully",
                    accessToken,
                    refreshToken,
                });
            }
            await this.sessionService.update(
                user.id,
                refreshToken,
                expiredDate
            );

            return res.status(HttpStatusCodeEnum.OK).json({
                message: "Login Succesfully",
                accessToken,
                refreshToken,
            });
        } catch (error) {
            return res
                .status(HttpStatusCodeEnum.BAD_REQUEST)
                .json({ error, message: ErrorMessageEnum.BAD_REQUEST });
        }
    }

    @httpPost("/signup")
    async signup(req: Request, res: Response) {
        try {
            const { username, email, password } = req.body;

            const hasEmail = await this.userService.findUserByEmail(email);
            if (hasEmail) {
                return res.status(HttpStatusCodeEnum.CONFLICT).json({
                    error: ErrorMessageEnum.CONFLICT,
                    message: "Email has already been registered",
                });
            }

            const hasUsername = await this.userService.findUserByUsername(
                username
            );
            if (hasUsername) {
                return res.status(HttpStatusCodeEnum.CONFLICT).json({
                    error: ErrorMessageEnum.CONFLICT,
                    message: "Username has already been taken",
                });
            }
            const hashPassword = await this.encryptionUtil.hashing(password);
            const newUser = await this.userService.create(
                username,
                email,
                hashPassword
            );
            await this.profileService.create(
                newUser.id,
                PROFILE.BIO,
                defaultProfile
            );

            const accessToken = this.jsonWebTokenUtil.createAccessToken(
                { id: newUser.id },
                ExpiresInEnum.ONE_HOUR
            );
            const refreshToken = this.jsonWebTokenUtil.createRefreshToken(
                { id: newUser.id },
                ExpiresInEnum.ONE_WEEK
            );
            const expiredDate =
                this.jsonWebTokenUtil.getExpirationDate(refreshToken);
            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                maxAge: 60 * 60 * 1000,
            });
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            await this.sessionService.create(
                newUser.id,
                refreshToken,
                expiredDate
            );

            return res.status(HttpStatusCodeEnum.OK).json({
                User: newUser,
                accessToken,
                refreshToken,
            });
        } catch (error) {
            return res
                .status(HttpStatusCodeEnum.BAD_REQUEST)
                .json({ error, message: ErrorMessageEnum.BAD_REQUEST });
        }
    }

    @httpGet("/logout")
    public async logout(req: Request, res: Response) {
        try {
            res.clearCookie("refreshToken");
            res.clearCookie("accessToken");
            return res
                .status(HttpStatusCodeEnum.OK)
                .json({ message: "Logout" });
        } catch (error) {
            return res.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
                error,
                message: ErrorMessageEnum.INTERNAL_SERVER_ERROR,
            });
        }
    }

    @httpGet("/check")
    public async checkCurrentUser(req: Request, res: Response) {
        try {
            const refreshToken = req.cookies.refreshToken;

            const verifyToken = await this.authService.verifyToken(
                refreshToken
            );

            if (!verifyToken) {
                return res
                    .status(HttpStatusCodeEnum.UNAUTHORIZED)
                    .json({ message: "Refresh Token is not valid or expired" });
            }

            const session = await this.sessionService.findSessionByRefreshToken(
                refreshToken
            );

            if (!session) {
                return res
                    .status(HttpStatusCodeEnum.UNAUTHORIZED)
                    .json({ message: "Session is over, please login" });
            }
            return res.status(HttpStatusCodeEnum.OK).json(session.user_id);
        } catch (error) {
            return res
                .status(HttpStatusCodeEnum.UNAUTHORIZED)
                .json({ error, message: ErrorMessageEnum.UNAUTHORIZED });
        }
    }

    @httpGet("/refresh-token")
    public async getNewAccessToken(req: Request, res: Response) {
        try {
            const accessToken = req.cookies.accessToken;
            const refreshToken = req.cookies.refreshToken;

            if (!accessToken) {
                const verifyToken =
                    this.jsonWebTokenUtil.verifyToken(accessToken);
                return res.status(HttpStatusCodeEnum.OK).json(verifyToken);
            }

            if (!refreshToken) {
                return res.status(HttpStatusCodeEnum.UNAUTHORIZED).json({
                    error: ErrorMessageEnum.UNAUTHORIZED,
                    message: "Refresh token is missing",
                });
            }

            const hasExpired =
                this.jsonWebTokenUtil.expiredChecker(refreshToken);

            if (hasExpired) {
                return res.status(HttpStatusCodeEnum.UNAUTHORIZED).json({
                    error: ErrorMessageEnum.UNAUTHORIZED,
                    message: "RefreshToken already expired",
                });
            }

            const session = await this.sessionService.findSessionByRefreshToken(
                refreshToken
            );
            if (!session && !hasExpired) {
                return res.status(HttpStatusCodeEnum.NOT_FOUND).json({
                    error: ErrorMessageEnum.NOT_FOUND,
                    message: "Session is not found",
                });
            }

            const newAccessToken = this.jsonWebTokenUtil.createAccessToken(
                { id: session?.user_id },
                ExpiresInEnum.ONE_HOUR
            );
            res.cookie("accessToken", newAccessToken, {
                httpOnly: true,
                maxAge: 60 * 60 * 1000,
            });

            return res.status(HttpStatusCodeEnum.OK).json({
                accessToken,
            });
        } catch (error) {
            return res
                .status(HttpStatusCodeEnum.BAD_REQUEST)
                .json({ error, message: ErrorMessageEnum.BAD_REQUEST });
        }
    }

    @httpGet("/verify-token")
    public verifyToken(req: Request, res: Response) {
        try {
            const accessToken = req.cookies.accessToken;
            if (!accessToken) {
                return res
                    .status(HttpStatusCodeEnum.NOT_FOUND)
                    .json({ error: ErrorMessageEnum.NOT_FOUND });
            }
            const verifyToken = this.jsonWebTokenUtil.verifyToken(accessToken);

            if (!verifyToken) {
                return res
                    .status(HttpStatusCodeEnum.UNAUTHORIZED)
                    .json({ error: ErrorMessageEnum.UNAUTHORIZED });
            }

            return res
                .status(HttpStatusCodeEnum.OK)
                .json({ message: SuccessMessageEnum.ACCESS_GRANTED });
        } catch (error) {
            return res
                .status(HttpStatusCodeEnum.BAD_REQUEST)
                .json({ error, message: ErrorMessageEnum.BAD_REQUEST });
        }
    }
}
