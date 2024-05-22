import App from "./app";
import container from "./container";
import { InversifyExpressServer } from "inversify-express-utils";

const appInstance = new App().app;
const server = new InversifyExpressServer(container, null, null, appInstance);
const app = server.build();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
