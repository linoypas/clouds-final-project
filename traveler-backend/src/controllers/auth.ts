import { Request, Response } from "express";
import User from "../models/users";
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

    const user = await User.create({
      email: req.body.email,
      username: req.body.username,
      password: hashedPassword,
      profilePicture: image,
    });
    res.status(200).send(user);
  } catch (err) {
    res.status(400).send(err);
    console.log(err)
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
    const user = await User.findOne({ where: { email: req.body.email } });
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
    const tokens = generateToken(user.id.toString());

    if (!tokens) {
      res.status(500).send("Server Error");
      return;
    }

    if (!user.refreshToken) {
      user.refreshToken = [];
    }
    const currentTokens = user.refreshToken || [];
    user.refreshToken = [...currentTokens, tokens.refreshToken];

    await user.save();

    res.status(200).send({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      id: user.id,
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

const verifyRefreshToken = (refreshToken: string | undefined) => {
  return new Promise<User>(async (resolve, reject) => {
    if (!refreshToken) {
      reject("fail");
      return;
    }
    if (!process.env.TOKEN_SECRET) {
      reject("fail");
      return;
    }
    jwt.verify(refreshToken, process.env.TOKEN_SECRET, async (err, payload: any) => {
      if (err) {
        reject("fail");
        return;
      }
      const userId = payload.id;
      try {
        const user = await User.findByPk(userId);
        if (!user) {
          reject("fail");
          return;
        }
        const tokens = user.refreshToken || [];
        if (!tokens.includes(refreshToken)) {
          user.refreshToken = [];
          await user.save();
          reject("fail");
          return;
        }
        // Remove used token from refreshToken list
        user.refreshToken = tokens.filter((t: string) => t !== refreshToken);
        await user.save();
        resolve(user);
      } catch (err) {
        reject(err);
      }
    });
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
    const tokens = generateToken(user.id.toString());

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
      _id: user.id,
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

const checkUsernameInDb = async(username: string) => {
    const user = await User.findOne({ where: { username } });
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
            let user = await User.findOne({ where: { email } });
            if (user == null) {
                let username = (payload?.given_name + "_" +  payload?.family_name).toLowerCase();
                const uniqueUsername = await generateUsernameWithSuffix(username);

                user = await User.create(
                    {
                        'email': email,
                        'profilePicture': image,
                        'username': uniqueUsername,
                        'password': '*'
                });
            }
            const tokens = generateToken(user.id.toString());
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
                    _id: user.id
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