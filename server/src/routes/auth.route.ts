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
  role?: Role;
  isGuest?: boolean;
}

interface UserDetails {
  id: string;
  token?: string;
  name: string;
  role?: Role;
}

const createTemporaryAuthToken = ({
  userId,
  name,
  role,
}: {
  userId: string;
  name: string;
  role: Role;
}) =>
  jwt.sign({ userId, name, role }, JWT_SECRET, {
    expiresIn: Number(JWT_EXPIRES_IN),
  });

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

  const token = createTemporaryAuthToken({
    userId: user.id,
    name: user.name!,
    role: Role.GUEST,
  });

  const UserDetails: UserDetails = {
    id: user.id,
    name: user.name!,
    token: token,
    role: user.role,
  };

  res.cookie("guest", token, { maxAge: COOKIE_MAX_AGE });
  res.json(UserDetails);
});

router.get("/refresh", async (req: Request, res: Response) => {
  if (req.user) {
    const user = req.user as UserDetails;

    const userDb = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        id: true,
        name: true,
        role: true,
      },
    });

    if (!userDb) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const token = createTemporaryAuthToken({
      userId: userDb.id,
      name: userDb.name ?? user.name,
      role: userDb.role,
    });

    res.json({
      token,
      id: userDb.id,
      name: userDb.name ?? user.name,
      role: userDb.role,
    });
  } else if (req.cookies && req.cookies.guest) {
    const decoded = jwt.verify(req.cookies.guest, JWT_SECRET) as userJwtClaims;
    const role = decoded.role ?? Role.GUEST;
    const token = createTemporaryAuthToken({
      userId: decoded.userId,
      name: decoded.name,
      role,
    });
    let User: UserDetails = {
      id: decoded.userId,
      name: decoded.name,
      token: token,
      role,
    };
    res.cookie("guest", token, { maxAge: COOKIE_MAX_AGE });
    res.json(User);
  } else {
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
});

export default router;
