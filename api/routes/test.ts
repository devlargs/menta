import { Request, Response } from "express";

export class Test {
    testApi() {
        return (req: Request, res: Response) => {
            res.send({ status: "Up and running" });
        }
    }
}