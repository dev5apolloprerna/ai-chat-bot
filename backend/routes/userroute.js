import { Router } from "express";
import { signup, login, verify, logout,fetchusers, auth1 } from "../controller/user.js";
import { auth } from "../controller/reg.js";



const userroute = Router();

userroute.post('/signup', signup);
userroute.post('/login', login);
userroute.post('/logout', logout);
userroute.get('/verify', verify);
userroute.post('/fetchusers', auth, fetchusers);
export default userroute;