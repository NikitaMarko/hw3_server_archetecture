import {IncomingMessage, ServerResponse} from "node:http";
import {UserController} from "../controllers/UserController.ts";
import {TYPE_DELETE, TYPE_GET, TYPE_POST, TYPE_PUT} from "../config/userServerConfig.ts";
import {parseRequestUrl} from "../utils/tools.ts";
import {myLogger} from "../events/logger.ts";

export const userRoutes =
    async (req:IncomingMessage, res:ServerResponse, controller:UserController) => {

      const {url,method} = req;
      const parseUrl = parseRequestUrl(req);

    switch(parseUrl.pathname + method) {
        case '/api/users' + TYPE_POST:{
            await controller.addUser(req, res);
           break;
        }
        case '/api/users' + TYPE_GET : {
            controller.getAllUsers(req, res)
            break;
        }
        case '/api/users' + TYPE_DELETE : {
            await controller.removeUser(req, res);
            break;
        }
        case '/api/user' + TYPE_GET : {
            controller.getUserById(req, res)
            break;
        }
        case '/api/users' + TYPE_PUT : {
            await controller.updateUser(req, res)
            break;
        }
        case '/api/logger' + TYPE_GET : {
            const allLogs = myLogger.getLogArray();
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(allLogs));
            break;
        }
            default:{
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.end('Page Not Found');
            }
    }
}