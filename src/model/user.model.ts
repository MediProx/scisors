import { Schema, Types, model, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IUsers extends Document{
    username: string;
    email: string;
    password: string;
    link: Types.ObjectId;
    comparePassword(userPassword: string): Promise<boolean>
}

export interface IUsersLogin extends Document{
    email: string;
    password: string;
}

const userSchema: Schema = new Schema<IUsers> ({
    username : {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        match: /.+\@.+\..+/,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    link: {
        type: Schema.Types.ObjectId,
        ref: "Links"
    }
}, { timestamps: true });


   //Prehook, After any user that signs up, the password gets hashed with the prehook b4 its being saved to the database. 
   userSchema.pre("save", async function(next) {
    const user = this;
    if (!user.isModified("password")) return next();
    if (user.isModified("password")) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) return next(err);
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err);
                user.password = hash;
                next();
            })
        })
    }
    
})

// To ensure that the user enters the correct cretdentials for logging in, we use the ffg codes
userSchema.methods.comparePassword = function (userPassword: string): Promise<boolean> {
    let password = this.password;

    const validPassword = bcrypt.compare(userPassword, password);
    return validPassword;

}

//to exclude the password from being sent back to the user
userSchema.methods.toJSON = function() {
    const obj = this.toObject();
    delete obj.password;
    return obj;
}


const User = model<IUsers>("Linkusers", userSchema);



export { User };
