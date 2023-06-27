import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const auth = (req: Request, res: Response, next: NextFunction) => {

    try {
        const token = req.headers.authorization!.split(" ")[1];
        const getUserInfo = jwt.verify(token, "dijw93483843908");
        req.body.findUser = getUserInfo;
        next();
    } catch (error) {
        res.status(401).json({message: "You are not authorized, Please sign up or login", error});
    }
    
}