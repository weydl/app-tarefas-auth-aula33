import { Router, Request, Response } from "express";
import * as UserModel from "../models/userModel";

export const authRoutes = Router();

authRoutes.get("/login", (req: Request, res: Response) => {
  const flash = req.session.flash;
  req.session.flash = null;

  res.render("login", { flash });
});

authRoutes.get("/", (req: Request, res: Response) => {
  res.redirect("/login");
});

// GET /registro
authRoutes.get("/registro", (req: Request, res: Response) => {
  const flash = req.session.flash;
  req.session.flash = null;

  res.render("registro", { flash });
});

// POST /registro
authRoutes.post("/registro", async (req: Request, res: Response) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      req.session.flash = "Preencha todos os campos";
      return res.redirect("/registro");
    }

    if (senha.length < 6) {
      req.session.flash = "A senha deve ter pelo menos 6 caracteres";
      return res.redirect("/registro");
    }

    await UserModel.registrar(nome, email, senha);

    req.session.flash = "Conta criada com sucesso!";
    return res.redirect("/login");
  } catch (error) {
    req.session.flash = "E-mail já cadastrado";
    return res.redirect("/registro");
  }
});

// POST /login
authRoutes.post("/login", async (req: Request, res: Response) => {
  const { email, senha } = req.body;

  const user = await UserModel.login(email, senha);

  if (!user) {
    req.session.flash = "Email ou senha incorretos";
    return res.redirect("/login");
  }

  req.session.userId = user.id;
  req.session.userName = user.nome;
  req.session.role = user.role;

  return res.redirect("/tarefas");
});

// GET /logout
authRoutes.get("/logout", (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});