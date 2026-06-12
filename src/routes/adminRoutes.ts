import { Router } from "express";
import * as UserModel from "../models/userModel";

import { requireAuth } from "../middleware/requireAuth";
import { requireRole } from "../middleware/requireRole";

import * as TarefaModel from "../models/tarefaModel";

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

adminRoutes.get(
  "/admin/tarefas",
  requireAuth,
  requireRole(Role.ADMIN),
  async (req, res) => {
    const tarefas = await TarefaModel.listarTodas();

    res.render("admin-tarefas", {
      tarefas,
    });
  }
);