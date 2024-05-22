import { TOKEN } from "./../constants/index";
import { injectable } from "inversify";
import jwt, { JwtPayload } from "jsonwebtoken";

@injectable()
export default class JsonWebTokenUtil {
    constructor() {}

    public createAccessToken(payload: object, expiresIn: string | number) {
        return jwt.sign(payload, TOKEN.ACCESS_TOKEN_SECRET, { expiresIn });
    }
    public createRefreshToken(payload: object, expiresIn: string | number) {
        return jwt.sign(payload, TOKEN.ACCESS_TOKEN_SECRET, { expiresIn });
    }

    public verifyToken(token: string) {
        return jwt.verify(token, TOKEN.ACCESS_TOKEN_SECRET);
    }

    public decodeToken(token: string) {
        const decoded = jwt.decode(token);
        
        if (typeof decoded === "object" && decoded && "id" in decoded) {
            return (decoded as JwtPayload).id;
        } else {
            return null;
        }
    }

    public expiredChecker(token: string) {
        const decoded = jwt.decode(token);
        if (
            typeof decoded === "object" &&
            decoded !== null &&
            decoded.exp !== undefined
        ) {
            return decoded.exp * 1000 < Date.now();
        }
    }

    public getExpirationDate(token: string): Date {
        const decoded: any = jwt.decode(token);
        if (!decoded || !decoded.exp) {
            throw new Error("Invalid token format or missing expiration");
        }
        const expirationTimestamp = decoded.exp;
        return new Date(expirationTimestamp * 1000);
    }
}
