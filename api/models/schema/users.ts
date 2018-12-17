import { Schema, model } from "mongoose";
import { dateOptions, emailRegex } from "../variables";

const UserSchema = new Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        match: emailRegex
    },
    password: { type: String, required: true }
}, dateOptions);

export const users = model(
  "Users",
  UserSchema
);
