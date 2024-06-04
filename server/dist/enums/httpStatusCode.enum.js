"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpStatusCodeEnum = void 0;
var HttpStatusCodeEnum;
(function (HttpStatusCodeEnum) {
    HttpStatusCodeEnum[HttpStatusCodeEnum["OK"] = 200] = "OK";
    HttpStatusCodeEnum[HttpStatusCodeEnum["CREATED"] = 201] = "CREATED";
    HttpStatusCodeEnum[HttpStatusCodeEnum["NO_CONTENT"] = 204] = "NO_CONTENT";
    HttpStatusCodeEnum[HttpStatusCodeEnum["NOT_MODIFIED"] = 304] = "NOT_MODIFIED";
    HttpStatusCodeEnum[HttpStatusCodeEnum["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    HttpStatusCodeEnum[HttpStatusCodeEnum["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    HttpStatusCodeEnum[HttpStatusCodeEnum["FORBIDDEN"] = 403] = "FORBIDDEN";
    HttpStatusCodeEnum[HttpStatusCodeEnum["NOT_FOUND"] = 404] = "NOT_FOUND";
    HttpStatusCodeEnum[HttpStatusCodeEnum["CONFLICT"] = 409] = "CONFLICT";
    HttpStatusCodeEnum[HttpStatusCodeEnum["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
})(HttpStatusCodeEnum || (exports.HttpStatusCodeEnum = HttpStatusCodeEnum = {}));
//# sourceMappingURL=httpStatusCode.enum.js.map