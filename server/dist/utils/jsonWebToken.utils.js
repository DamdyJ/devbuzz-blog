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
const index_1 = require("./../constants/index");
const inversify_1 = require("inversify");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
let JsonWebTokenUtil = class JsonWebTokenUtil {
    constructor() { }
    createAccessToken(payload, expiresIn) {
        return jsonwebtoken_1.default.sign(payload, index_1.TOKEN.ACCESS_TOKEN_SECRET, { expiresIn });
    }
    createRefreshToken(payload, expiresIn) {
        return jsonwebtoken_1.default.sign(payload, index_1.TOKEN.REFRESH_TOKEN_SECRET, { expiresIn });
    }
    verifyToken(token) {
        return jsonwebtoken_1.default.verify(token, index_1.TOKEN.ACCESS_TOKEN_SECRET);
    }
    verifyRefreshToken(refreshToken) {
        return jsonwebtoken_1.default.verify(refreshToken, index_1.TOKEN.REFRESH_TOKEN_SECRET);
    }
    decodeTokenAndGetId(token) {
        return jsonwebtoken_1.default.decode(token);
    }
    decodeToken(token) {
        const decoded = jsonwebtoken_1.default.decode(token);
        if (typeof decoded === "object" && decoded && "id" in decoded) {
            return decoded.id;
        }
        else {
            return null;
        }
    }
    expiredChecker(token) {
        const decoded = jsonwebtoken_1.default.decode(token);
        if (typeof decoded === "object" &&
            decoded !== null &&
            decoded.exp !== undefined) {
            return decoded.exp * 1000 < Date.now();
        }
    }
    getExpirationDate(token) {
        const decoded = jsonwebtoken_1.default.decode(token);
        if (!decoded || !decoded.exp) {
            throw new Error("Invalid token format or missing expiration");
        }
        const expirationTimestamp = decoded.exp;
        return new Date(expirationTimestamp * 1000);
    }
};
JsonWebTokenUtil = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], JsonWebTokenUtil);
exports.default = JsonWebTokenUtil;
//# sourceMappingURL=jsonWebToken.utils.js.map