"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const httpStatusCode_enum_1 = require("../enums/httpStatusCode.enum");
const errorMessage_enum_1 = require("../enums/errorMessage.enum");
const constants_1 = require("../constants");
async function AuthenticateToken(req, res, next) {
    try {
        const accessToken = req.cookies.accessToken;
        const refreshToken = req.cookies.refreshToken;
        if (!accessToken && !refreshToken) {
            return res
                .status(httpStatusCode_enum_1.HttpStatusCodeEnum.UNAUTHORIZED)
                .send(errorMessage_enum_1.ErrorMessageEnum.UNAUTHORIZED);
        }
        // Verify the access token
        jsonwebtoken_1.default.verify(accessToken, constants_1.TOKEN.ACCESS_TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                // Access token is expired or invalid
                try {
                    // Verify the refresh token
                    const decodedRefreshToken = jsonwebtoken_1.default.verify(refreshToken, constants_1.TOKEN.REFRESH_TOKEN_SECRET);
                    // Use the refresh token to generate a new access token
                    const newAccessToken = jsonwebtoken_1.default.sign({ id: decodedRefreshToken.id }, constants_1.TOKEN.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
                    // Set the new access token in the response cookie
                    res.cookie("accessToken", newAccessToken, {
                        httpOnly: true,
                        maxAge: 60 * 60 * 1000, // 1 hour expiration
                    });
                    // Set the user object in the request
                    req.user = decodedRefreshToken;
                    // Proceed to the next middleware
                    next();
                }
                catch (error) {
                    // Refresh token is invalid
                    return res
                        .status(httpStatusCode_enum_1.HttpStatusCodeEnum.UNAUTHORIZED)
                        .send(errorMessage_enum_1.ErrorMessageEnum.UNAUTHORIZED);
                }
            }
            else {
                // Access token is valid
                req.user = decoded;
                next();
            }
        });
    }
    catch (error) {
        console.error("Error in token authentication middleware:", error);
        return res
            .status(httpStatusCode_enum_1.HttpStatusCodeEnum.INTERNAL_SERVER_ERROR)
            .send(errorMessage_enum_1.ErrorMessageEnum.INTERNAL_SERVER_ERROR);
    }
}
exports.default = AuthenticateToken;
//# sourceMappingURL=auth.middleware.js.map