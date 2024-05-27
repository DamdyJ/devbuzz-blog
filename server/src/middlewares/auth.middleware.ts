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

        jwt.verify(
            accessToken,
            TOKEN.ACCESS_TOKEN_SECRET,
            async (err: VerifyErrors | null, decoded: any) => {
                if (err) {
                  
                    try {
                        const decodedRefreshToken = jwt.verify(
                            refreshToken,
                            TOKEN.REFRESH_TOKEN_SECRET
                        ) as { id: string };
                        const newAccessToken = jwt.sign(
                            { id: decodedRefreshToken.id },
                            TOKEN.ACCESS_TOKEN_SECRET,
                            { expiresIn: "1h" }
                        );
                        res.cookie("accessToken", newAccessToken, {
                            httpOnly: true,
                            maxAge: 60 * 60 * 1000, 
                        });
                    
                        req.user = decodedRefreshToken;
                        next();
                    } catch (error) {
                        return res
                            .status(HttpStatusCodeEnum.UNAUTHORIZED)
                            .send(ErrorMessageEnum.UNAUTHORIZED);
                    }
                } else {
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
