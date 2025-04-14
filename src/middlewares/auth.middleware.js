import jwt from 'jsonwebtoken';
import { User } from "../models/index.js";
const verifyJWTAccessToken = async (req,res,next)=>{
  await verifyJWTToken("access",req,res,next);
}
const verifyJWTRefreshToken = async (req,res,next)=>{
  await verifyJWTToken("refresh",req,res,next);
}

const verifyJWTToken = async (tokenType,req,res,next)=>{
  const token = tokenType.toUpperCase() === "ACCESS" ? req.cookies.accessToken : req.cookies.refreshToken ;
  if(!token) return res.status(401).json({ error: 'Token missing' });
  jwt.verify(token, process.env[`${tokenType.toUpperCase()}_TOKEN_SECRET`], async(err, user) => {
      if (err) {
        // Handle expired or invalid token
        return res.status(401).json({ error: err.message });
      }
      const {_id,username,email} = user;
      const response = await User.findOne({_id,...(username && {username}),...(email && {email})});
      if(!!response){
        req.user ={_id,username:response.username,email:response.email};
        next();
      }
      else{
        return res.status(404).json({ error: 'Unauthoried' });
      }
    })
}

export default {verifyJWTToken,verifyJWTAccessToken,verifyJWTRefreshToken};