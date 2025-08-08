import { Request, Response } from "express";
import userModel, { IUser } from "../models/users";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Document } from "mongoose";
import multer from "multer";
import path from "path";
import passport from "passport"; 
import fs from 'fs';
import mongoose from "mongoose";
import { OAuth2Client } from 'google-auth-library';


const client = new OAuth2Client();

const uploadDir = path.resolve(process.cwd(), 'public/profile-pictures');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const register = async (req: Request, res: Response) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const image = (req as any).file ? `/public/profile-pictures/${(req as any).file.filename}` : "/public/profile-pictures/default.png";

    const user = await userModel.create({
      email: req.body.email,
      username: req.body.username,
      password: hashedPassword,
      image: image,
    });
    res.status(200).send(user);
  } catch (err) {
    res.status(400).send(err);
  }
};

type tTokens = {
  accessToken: string;
  refreshToken: string;
};

const verifyGoogleToken = async (token: string) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID, 
    });

    const payload = ticket.getPayload();

    return payload;
  } catch (error) {
    throw new Error('Invalid Google token');
  }
};

const generateToken = (userId: string): tTokens | null => {
  if (!process.env.TOKEN_SECRET) {
    return null;
  }
  const random = Math.random().toString();
  const accessToken = jwt.sign(
    {
      _id: userId,
      random: random,
    },
    process.env.TOKEN_SECRET,
    { expiresIn: process.env.TOKEN_EXPIRES }
  );

  const refreshToken = jwt.sign(
    {
      _id: userId,
      random: random,
    },
    process.env.TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES }
  );
  return {
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
};

const login = async (req: Request, res: Response) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      res.status(403).send("wrong username or password");
      return;
    }
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password || ""
    );
    if (!validPassword) {
      res.status(403).send("wrong username or password");
      return;
    }
    if (!process.env.TOKEN_SECRET) {
      res.status(500).send("Server Error");
      return;
    }
    const tokens = generateToken(user._id.toString());

    if (!tokens) {
      res.status(500).send("Server Error");
      return;
    }

    if (!user.refreshToken) {
      user.refreshToken = [];
    }
    user.refreshToken.push(tokens.refreshToken);
    await user.save();
    res.status(200).send({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      _id: user._id,
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

type tUser = Document<unknown, object, IUser> &
  IUser &
  Required<{
    _id: mongoose.Types.ObjectId;
  }> & {
    __v: number;
  };

const verifyRefreshToken = (refreshToken: string | undefined) => {
  return new Promise<tUser>((resolve, reject) => {
    if (!refreshToken) {
      reject("fail");
      return;
    }
    //verify token
    if (!process.env.TOKEN_SECRET) {
      reject("fail");
      return;
    }
    jwt.verify(
      refreshToken,
      process.env.TOKEN_SECRET,
      async (err: any, payload: any) => {
        if (err) {
          reject("fail");
          return;
        }
        //get the user id fromn token
        const userId = payload._id;
        try {
          const user = await userModel.findById(userId);
          if (!user) {
            reject("fail");
            return;
          }
          if (!user.refreshToken || !user.refreshToken.includes(refreshToken)) {
            user.refreshToken = [];
            await user.save();
            reject("fail");
            return;
          }
          const tokens = user.refreshToken!.filter(
            (token) => token !== refreshToken
          );
          user.refreshToken = tokens;

          resolve(user);
        } catch (err) {
          reject(err);
          return;
        }
      }
    );
  });
};

const logout = async (req: Request, res: Response) => {
  try {
    const user = await verifyRefreshToken(req.body.refreshToken);
    await user.save();
    res.status(200).send("success");
  } catch (err) {
    res.status(400).send(err);
  }
};

const refresh = async (req: Request, res: Response) => {
  try {
    const user = await verifyRefreshToken(req.body.refreshToken);
    if (!user) {
      res.status(400).send("fail");
      return;
    }
    const tokens = generateToken(user._id.toString());

    if (!tokens) {
      res.status(500).send("Server Error");
      return;
    }
    if (!user.refreshToken) {
      user.refreshToken = [];
    }
    user.refreshToken.push(tokens.refreshToken);
    await user.save();
    res.status(200).send({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      _id: user._id,
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

const checkUsernameInDb = async(username: string) => {
    const user = await userModel.findOne({ username });
    return user !== null;
}

const generateUsernameWithSuffix = async(baseUsername: string) => {
    if(await checkUsernameInDb(baseUsername)){
        let suffix = 1;
        let newUsername = `${baseUsername}${suffix}`;
        
        while (await checkUsernameInDb(newUsername)) {
          suffix += 1;
          newUsername = `${baseUsername}${suffix}`;
        }
        return newUsername;
    } else{
        return baseUsername; 
    }
  }


const googleSignin = async (req: Request, res: Response): Promise<void> => {
  const credential = req.body.token;
  try {
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const email = payload?.email
        const image = payload?.picture

        if(email != null){
            let user = await userModel.findOne({'email': email});
            if (user == null) {
                let username = (payload?.given_name + "_" +  payload?.family_name).toLowerCase();
                const uniqueUsername = await generateUsernameWithSuffix(username);

                user = await userModel.create(
                    {
                        'email': email,
                        'profilePicture': image,
                        'username': uniqueUsername,
                        'password': '*'
                });
            }
            const tokens = generateToken(user._id.toString());
            if (!tokens) {
                res.status(500).send('Server Error');
                return;
            }
            if (!user.refreshToken) {
                user.refreshToken = [];
            }
            user.refreshToken.push(tokens.refreshToken);
            await user.save();
            res.status(200).send(
                {
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken,
                    _id: user._id
                });
        }
  } catch (err) {
      console.error('Error during Google OAuth:', err);
      res.status(400).send(err);
  }
}




export default {
  register, 
  login,
  refresh,
  logout,
  googleSignin
};