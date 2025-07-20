import {createServer} from "node:http";
import {BASE_URL, PORT} from "./config/userServerConfig.ts";
import {userRoutes} from "./routes/userRoutes.ts";
import {UserController} from "./controllers/UserController.ts";
import {UserServiceEmbeddedImpl} from "./service/UserserviceEmbeddedImpl.ts";


export const launchServer = () => {
    const userService = new UserServiceEmbeddedImpl()
    const userController:UserController = new UserController(userService);

    createServer(async (req, res) => {
        await userRoutes(req, res, userController);
    }).listen(PORT, ()=> {
        console.log(`UserServer runs at ${BASE_URL}:${PORT}`);
    });
}