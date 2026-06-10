import { Router } from "express";
import * as UserModel from "../models/userModel";

import { requireAuth } from "../middleware/requireAuth";
import { requireRole } from "../middleware/requireRole";

import { Role } from "../types/Role";

export const adminRoutes = Router();

adminRoutes.get(
  "/admin",
  requireAuth,
  requireRole(Role.ADMIN),
  async (req, res) => {

    const usuarios =
      await UserModel.listarUsuarios();

    res.render("admin", {
      usuarios
    });
  }
);