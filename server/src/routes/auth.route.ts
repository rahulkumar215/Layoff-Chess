import type { Request, Response } from "express";
import { Router } from "express";
import { prisma } from "./../config/prisma.js";
import { COOKIE_MAX_AGE } from "../consts.js";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { Role } from "../generated/prisma/enums.js";
import appConfig from "../config/appConfig.js";
const router = Router();

const { JWT_SECRET, JWT_EXPIRES_IN } = appConfig;

interface userJwtClaims {
  userId: string;
  name: string;
  isGuest?: boolean;
}

interface UserDetails {
  id: string;
  token?: string;
  name: string;
  role?: Role;
}

router.post("/guest", async (req: Request, res: Response) => {
  const bodyData = req.body;
  let guestUUID = "guest-" + uuidv4();

  const user = await prisma.user.create({
    data: {
      username: guestUUID,
      email: guestUUID + "@layoffchess.com",
      name: bodyData.name || guestUUID,
      role: "GUEST",
    },
  });

  const token = jwt.sign(
    {
      userId: user.id,
      name: user.name,
      role: Role.GUEST,
    },
    JWT_SECRET,
    {
      expiresIn: Number(JWT_EXPIRES_IN),
    },
  );

  const UserDetails: UserDetails = {
    id: user.id,
    name: user.name!,
    token: token,
    role: user.role,
  };

  res.cookie("guest", token, { maxAge: COOKIE_MAX_AGE });
  res.json(UserDetails);
});

export default router;
