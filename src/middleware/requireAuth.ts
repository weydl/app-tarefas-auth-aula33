import { Request, Response, NextFunction } from "express";

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.session.userId) {
    req.session.flash = "Faça login para continuar";
    return res.redirect("/login");
  }

  next();
}