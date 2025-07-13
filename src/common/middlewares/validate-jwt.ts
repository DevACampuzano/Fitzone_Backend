import type { Request, Response, NextFunction } from "express";
import { type VerifyErrors, verify } from "jsonwebtoken";

// Extend Express Request interface to include 'decoded'
declare module "express-serve-static-core" {
  interface Request {
    decoded?: any;
  }
}

export const validateJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["access-token"] || "";

  if (typeof token === "object" || token === "") {
    res.status(503).json({
      status: false,
      message: "INVALID-TOKEN",
    });
    return;
  }

  try {
    req["decoded"] = await validateToken(token, req.app.get("key"));
    next();
  } catch (error) {
    console.error("Error al validar token", error);
    res.status(503).json({ status: false, message: "INVALID-TOKEN" });
    return;
  }
};

export const validateToken = async (token: string, key: string) => {
  try {
    return await verify(
      token,
      key,
      async (err: VerifyErrors | null, decoded) => {
        if (err) throw "INVALID_TOKEN";

        return decoded;
      }
    );
  } catch (error) {
    throw error;
  }
};

export default { validateJWT, validateToken };
