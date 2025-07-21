import { Request, Response, NextFunction } from "express";
import statusCodes from "http-status-codes";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

interface TokenPayload {
  userId: string;
  hasManagerialRole?: boolean;
  hasAccountingRole?: boolean;
}

interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

const staffAuthentication = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const encryptedToken = req.cookies.accesstoken;

    if (!encryptedToken) {
      return res.status(statusCodes.UNAUTHORIZED).json({
        msg: "NO TOKEN FOUND",
      });
    }

    const tokenPayload = jwt.verify(
      encryptedToken,
      process.env.JWT_SECRET!
    ) as TokenPayload;

    req.user = {
      userId: tokenPayload.userId,
      hasManagerialRole: tokenPayload.hasManagerialRole || false,
      hasAccountingRole: tokenPayload.hasAccountingRole || false,
    };

    next(); 
  } catch (error) {
    return res.status(statusCodes.UNAUTHORIZED).json({
      msg: "INVALID OR EXPIRED TOKEN",
    });
  }
};

export default staffAuthentication;
