import {UserService} from "../service/userService.ts";
import {parseBody, parseRequestUrl} from "../utils/tools.ts";
import {User} from "../model/userTypes.ts";
import {IncomingMessage, ServerResponse} from "node:http";
import {myLogger} from "../events/logger.ts";

export class UserController {
    constructor(private userService: UserService) {
    }
    async addUser(req:IncomingMessage,res:ServerResponse){
        const body = await parseBody(req) as User;
        const isSuccess = this.userService.addUser(body);

        if (isSuccess) {
            myLogger.log('Start executing code addUser')
            res.writeHead(201, {'Content-Type': 'text/html'})
            myLogger.save(`User with id ${body.id} and userName ${body.userName} was successfully created`);
            res.end('User was added')
            myLogger.log(`Response for add user with id ${body.id} and userName ${body.userName} was send`)

        } else {
            res.writeHead(409, {'Content-Type': 'text/html'})
            res.end('User already exists')
            myLogger.log(`Response for add user with id ${body.id} and userName ${body.userName} was already exists `);
        }

    }
    getAllUsers(req:IncomingMessage,res:ServerResponse){
        const users = this.userService.getAllUsers()
        myLogger.log('Start executing code getAllUsers')
        res.writeHead(200, {"Content-Type": "application/json"})
        res.end(JSON.stringify(users))
        myLogger.log('Array of all users was successfully retrieved')
    }

    async removeUser(req:IncomingMessage,res:ServerResponse){
       const user = await parseBody(req) as User;
       const isSuccess = this.userService.removeUser(user.id);

       if (isSuccess) {
           myLogger.log('Start executing code removeUser')
            res.writeHead(200, {"Content-Type": "application/json"})
            res.end(JSON.stringify(isSuccess))
           myLogger.save(`User with id ${user.id} was successfully removed from array`)
        } else {
            res.writeHead(404, {"Content-Type": "text/html"})
            res.end("User not found")
           myLogger.log(`Response from remove user. User not found`)
        }
    }
    getUserById(req:IncomingMessage,res:ServerResponse){
        const id = parseRequestUrl(req).searchParams.get('Id');
        if(!id){
            myLogger.log('Start executing code getUserById')
            res.writeHead(409, {'Content-Type': 'text/html'})
            res.end('No id was received to find the user')
            myLogger.save(`User with id ${id} was not found`)
        }else {
            const founded = this.userService.getUserById(+id);
            if(founded !== null){
                res.writeHead(200, {'Content-Type': 'application/json'})
                res.end(JSON.stringify(founded))
                myLogger.log(`User with id ${id} was successfully found`)
            }else{
                res.writeHead(404, {'Content-Type': 'text/html'})
                res.end('User not found')
                myLogger.log(`Response from user with id ${id} was not found`)
            }
        }
    }
    async updateUser(req:IncomingMessage,res:ServerResponse){
        const user = await parseBody(req) as User;
        const isSuccess = this.userService.updateUser(user);
        if (isSuccess) {
            myLogger.log('Start executing code updateUser')
            res.writeHead(200, {'Content-Type': 'html/plain'})
            res.end('User was updated')
            myLogger.save(`User with id ${user.id} and userName ${user.userName} was successfully updated`)
        }else{
            res.writeHead(404, {'Content-Type': 'text/html'})
            res.end('User not found')
            myLogger.log(`Response from update user with id ${user.id} was not found`)
        }
    }
}