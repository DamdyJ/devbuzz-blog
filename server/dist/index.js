"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const container_1 = __importDefault(require("./container"));
const inversify_express_utils_1 = require("inversify-express-utils");
const appInstance = new app_1.default().app;
const server = new inversify_express_utils_1.InversifyExpressServer(container_1.default, null, null, appInstance);
const app = server.build();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map