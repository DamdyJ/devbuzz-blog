import { NextFunction, Response } from "express";
import jwt, { VerifyErrors } from "jsonwebtoken";
import { HttpStatusCodeEnum } from "../enums/httpStatusCode.enum";
import { ErrorMessageEnum } from "../enums/errorMessage.enum";
import { TOKEN } from "../constants";
import { Request } from "express";

interface IRequest extends Request {
    user?: any;
}

export default async function AuthenticateToken(
    req: IRequest,
    res: Response,
    next: NextFunction
) {
    try {
        const accessToken = req.cookies.accessToken; 
        const refreshToken = req.cookies.refreshToken;
        if (!accessToken && !refreshToken) {
            return res
                .status(HttpStatusCodeEnum.UNAUTHORIZED)
                .send(ErrorMessageEnum.UNAUTHORIZED);
        }

        // Verify the access token
        jwt.verify(
            accessToken,
            TOKEN.ACCESS_TOKEN_SECRET,
            async (err: VerifyErrors | null, decoded: any) => {
                if (err) {
                    // Access token is expired or invalid
                    try {
                        // Verify the refresh token
                        const decodedRefreshToken = jwt.verify(
                            refreshToken,
                            TOKEN.REFRESH_TOKEN_SECRET
                        ) as { id: string };

                        // Use the refresh token to generate a new access token
                        const newAccessToken = jwt.sign(
                            { id: decodedRefreshToken.id },
                            TOKEN.ACCESS_TOKEN_SECRET,
                            { expiresIn: "1h" }
                        );

                        // Set the new access token in the response cookie
                        res.cookie("accessToken", newAccessToken, {
                            httpOnly: true,
                            maxAge: 60 * 60 * 1000, // 1 hour expiration
                        });

                        // Set the user object in the request
                        req.user = decodedRefreshToken;

                        // Proceed to the next middleware
                        next();
                    } catch (error) {
                        // Refresh token is invalid
                        return res
                            .status(HttpStatusCodeEnum.UNAUTHORIZED)
                            .send(ErrorMessageEnum.UNAUTHORIZED);
                    }
                } else {
                    // Access token is valid
                    req.user = decoded;
                    next();
                }
            }
        );
    } catch (error) {
        console.error("Error in token authentication middleware:", error);
        return res
            .status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR)
            .send(ErrorMessageEnum.INTERNAL_SERVER_ERROR);
    }
}
