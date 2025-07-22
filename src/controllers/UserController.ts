import {UserService} from "../service/userService.ts";
import {parseBody, parseRequestUrl} from "../utils/tools.ts";
import {User} from "../model/userTypes.ts";
import {IncomingMessage, ServerResponse} from "node:http";
import {myLogger} from "../events/logger.ts";
import {TYPE_HTML, TYPE_JSON, TYPE_TEXT} from "../config/userServerConfig.ts";

export class UserController {
    constructor(private userService: UserService) {
    }
    async addUser(req:IncomingMessage,res:ServerResponse){
        const body = await parseBody(req) as User;
        const isSuccess = this.userService.addUser(body);

        if (isSuccess) {
            myLogger.log('Start executing code addUser')
            res.writeHead(201, TYPE_TEXT)
            myLogger.save(`User with id ${body.id} and userName ${body.userName} was successfully created`);
            res.end('User was added')
            myLogger.log(`Response for add user with id ${body.id} and userName ${body.userName} was send`)

        } else {
            res.writeHead(409, TYPE_TEXT)
            res.end('User already exists')
            myLogger.log(`Response for add user with id ${body.id} and userName ${body.userName} was already exists `);
        }

    }
    getAllUsers(req:IncomingMessage,res:ServerResponse){
        const users = this.userService.getAllUsers()
        myLogger.log('Start executing code getAllUsers')
        res.writeHead(200, TYPE_JSON)
        res.end(JSON.stringify(users))
        myLogger.log('Array of all users was successfully retrieved')
    }

    async removeUser(req:IncomingMessage,res:ServerResponse){
        let user: User | undefined;
        try{
            const user = await parseBody(req) as User;
            myLogger.log('Start executing code removeUser')
       const isSuccess = this.userService.removeUser(user.id);

       if (isSuccess) {

            res.writeHead(200, TYPE_JSON)
            res.end(JSON.stringify(isSuccess))
           myLogger.save(`User with id ${user.id} was successfully removed from array`)
           } else {
            res.writeHead(404, TYPE_TEXT)
            res.end("User not found")
           myLogger.log(`Response from remove user. User not found`)
        }}catch (e: any) {
            if (e.message === "404") {
                res.writeHead(404, TYPE_TEXT);
                res.end(`User with id ${user?.id || 'unknown'} not found`);
                myLogger.log(`User with id ${user?.id || 'unknown'} not found`);
            } else {
                res.writeHead(500, TYPE_TEXT);
                res.end("Unexpected server error");
                myLogger.log(`Unexpected error in removeUser`);
                myLogger.save(`Error: ${e.stack || JSON.stringify(e)}`);
            }
        }
    }
    getUserById(req:IncomingMessage,res:ServerResponse){
        const id = parseRequestUrl(req).searchParams.get('Id');

        myLogger.log('Start executing code getUserById')
        if(!id){

            res.writeHead(409, TYPE_TEXT)
            res.end('No id was received to find the user')
            myLogger.save(`User with id ${id} was not found`)
        }try {
            const founded = this.userService.getUserById(+id!);
            if(founded !== null){
                res.writeHead(200, TYPE_JSON)
                res.end(JSON.stringify(founded))
                myLogger.log(`User with id ${id} was successfully found`)
            }
            else {
                throw new Error('404')
            }
            } catch (e) {
            if(e === "404"){
                res.writeHead(404, TYPE_TEXT)
                res.end(`User with id ${id} not found`)
                myLogger.log(`User with id ${id} not found`);
            }else{
                res.writeHead(500, TYPE_TEXT)
                res.end('Unexpected server error')
                myLogger.log(`Server error`);
                myLogger.save(`Server error` + JSON.stringify(e));
            }
        }
    }

    async updateUser(req:IncomingMessage,res:ServerResponse){
        const user = await parseBody(req) as User;
        try{
        const isSuccess = this.userService.updateUser(user);
        if (isSuccess) {
            myLogger.log('Start executing code updateUser')
            res.writeHead(200, TYPE_HTML)
            res.end('User was updated')
            myLogger.save(`User with id ${user.id} and userName ${user.userName} was successfully updated`)
        }
        }catch (e) {
            if(e === "404"){
                res.writeHead(404, TYPE_TEXT)
                res.end(`User not found`)
                myLogger.log(`User to update not found`);
            }
        else{
            res.writeHead(404, TYPE_TEXT)
            res.end('User not found')
            myLogger.log(`Response from update user with id ${user.id} was not found`)
        }
    }
}}