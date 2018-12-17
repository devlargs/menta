import { Request, Response } from "express";
import { users } from "../models"
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const updates: any = {};
const conn: any = [];

export class Users {
    User = users;

    stream() {
        return (req: Request, res: Response) => {
            res.sseSetup();
            conn.push(res);
        }
    }

    sendUpdate(data: any) {
        for(var i = 0; i < conn.length; i++) {
            updates["data"] = data;
            conn[i].sseSend(updates)
        }
    }

    getUsers() {
        return (req: Request, res: Response) => {
            res.send({ get: "users" })
        }
    }

    postUsers(){
        return (req: Request, res: Response) => {
            this.User.find({ email: req.body.email }).exec().then(user => {
                if (user.length >= 1) {
                    return res.send({ status: 409, message: "Email already exists" });
                } else {
                    bcrypt.hash(req.body.password, 10, (err, hash) => {
                        if (err) {
                            return res.send({ status: 500, error: err });
                        } else {
                            const user = new this.User({
                                _id: new mongoose.Types.ObjectId(),
                                email: req.body.email,
                                password: hash
                            });
                            user.save().then(data => {
                                this.sendUpdate(data);
                                res.send({
                                    status: 200,
                                    data,
                                    message: "Successfully added"
                                });
                            }).catch(err => {
                                res.send({ status: 500, error: err });
                            });
                        }
                    });
                }
            });
        }
    }
    
    loginUser(){
        return (req: Request, res: Response) => {
            this.User.find({ email: req.body.email }).exec().then((user: any) => {
                if (user.length < 1) {
                    return res.send({ status: 401, message: "No user found" });
                }

                bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                    if (err) {
                        return res.send({ status: 401, message: "Invalid token" });
                    }
                    if (result) {
                        const token = jwt.sign(
                            {
                                email: user[0].email,
                                userId: user[0]._id
                            },
                            typeof process.env.JWT_KEY !== "undefined" ? process.env.JWT_KEY : "secret",
                            {
                                expiresIn: "365d"
                            }
                        );
                        return res.send({
                            status: 200,
                            message: "Successfully Authenticated",
                            token: token,
                            data: user[0]
                        });
                    }
                    res.send({ message: "Authentication failed", status: 401 });
                });
            }).catch(err => {
                console.log(err);
                res.send({ error: err, status: 500 });
            });
        }
    }

    deleteUser() {
        return (req: Request, res: Response) => {
            this.User.remove({ _id: req.params.userId }).exec().then(_ => {
                res.send({
                    status: 200,
                    message: "User deleted"
                });
            }).catch(err => {
                console.log(err);
                res.send({ error: err, status: 500 });
            });
        }   
    }
}