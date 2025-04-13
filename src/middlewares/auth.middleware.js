import jwt from 'jsonwebtoken';
import { User } from "../models/index.js";
const verifyJWTAcessToken = async (req,res,next)=>{
  const token = req.cookies.accessToken
  if(!token) return res.status(401).json({ error: 'Token missing' });
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async(err, user) => {
      if (err) {
        // Handle expired or invalid token
        return res.status(401).json({ error: 'Access token expired or invalid' });
      }
      const {_id,username,email} = user;
      const response = await User.findOne({_id,username,email});
      if(!!response){
        req.user ={_id,username,email};
        next();
      }
      else{
        return res.status(404).json({ error: 'Unauthoried' });
      }
    })
}

export default {verifyJWTAcessToken};