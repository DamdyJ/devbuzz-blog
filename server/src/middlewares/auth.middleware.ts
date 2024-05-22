import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { HttpStatusCodeEnum } from "../enums/httpStatusCode.enum";
import { ErrorMessageEnum } from "../enums/errorMessage.enum";
import { TOKEN } from "../constants";
import { Request } from "express";

interface IRequest extends Request{
    user? : any
}

export function authenticeToken(
    req: IRequest,
    res: Response,
    next: NextFunction
) {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (token) {
            const decoded = jwt.verify(token, TOKEN.ACCESS_TOKEN_SECRET);
            req.user = decoded;
        } else {
            return res
                .status(HttpStatusCodeEnum.UNAUTHORIZED)
                .send(ErrorMessageEnum.UNAUTHORIZED);
        }
        next();
    } catch (error) {
        return res.status(403).send(error);
    }
}
