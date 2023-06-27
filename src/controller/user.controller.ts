import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User, IUsers, IUsersLogin } from "../model/user.model";
import { HydratedDocument } from "mongoose";
import jwt from "jsonwebtoken"


export const userSignup = (req: Request, res: Response) => {
    const { username, email, password }: IUsers = req.body;

    bcrypt.hash(password, 10, async(err, hash) => {
        try {
        const newUser: HydratedDocument<IUsers> = new User ({
            username,
            email,
            password: hash
        })
        
        const savedUser = await newUser.save();
        res.status(200).json(savedUser);
        
    } catch (error) {
        res.status(500).json(error);
    }
    })
    
}

export const userLogin = async(req: Request, res: Response) => {
    const { email, password }: IUsersLogin = req.body;

    try {
        const findUser = await User.findOne({email});
        if (!findUser) {
            return res.status(404).json({message: "Invalid details, please enter the correct details or sign up!"});
        }

        const compareBothPasswords = findUser.comparePassword(password);
        if (!compareBothPasswords) {
            return res.status(401).json({message: "Invalid password!"});
        }
        const token = await jwt.sign({id: findUser._id}, "dijw93483843908");
        return res.status(200).json({token, user: {name: findUser.username} });
    } catch (error) {
        res.status(500).json(error);
    }

}