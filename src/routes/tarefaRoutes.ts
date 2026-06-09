import { Router, Request, Response } from "express";
import * as TarefaModel from "../models/tarefaModel";
import { authRoutes } from "./authRoutes";

export const tarefaRoutes = Router();

// GET /tarefas
authRoutes.get("/tarefas", async (req: Request, res: Response) => {
  if (!req.session.userId) {
    req.session.flash = "Faça login para continuar";
    return res.redirect("/login");
  }

  const tarefas = await TarefaModel.listarPorUsuario(
    req.session.userId
  );

  const flash = req.session.flash;
  req.session.flash = null;

  return res.render("tarefas", {
    nome: req.session.userName,
    tarefas,
    flash,
  });
});

// POST /tarefas
tarefaRoutes.post("/tarefas", async (req: Request, res: Response) => {
  if (!req.session.userId) {
    req.session.flash = "Faça login para continuar";
    return res.redirect("/login");
  }

  const { texto } = req.body;

  if (!texto || texto.trim() === "") {
    req.session.flash = "Digite uma tarefa";
    return res.redirect("/tarefas");
  }

  await TarefaModel.adicionar(
    req.session.userId,
    texto.trim()
  );

  req.session.flash = "Tarefa adicionada!";
  return res.redirect("/tarefas");
});

// POST /tarefas/:id/concluir
tarefaRoutes.post(
  "/tarefas/:id/concluir",
  async (req: Request, res: Response) => {
    if (!req.session.userId) {
      req.session.flash = "Faça login para continuar";
      return res.redirect("/login");
    }

    const id = Number(req.params.id);

    await TarefaModel.toggleConcluida(
      req.session.userId,
      id
    );

    return res.redirect("/tarefas");
  }
);

// POST /tarefas/:id/remover
tarefaRoutes.post(
  "/tarefas/:id/remover",
  async (req: Request, res: Response) => {
    if (!req.session.userId) {
      req.session.flash = "Faça login para continuar";
      return res.redirect("/login");
    }

    const id = Number(req.params.id);

    await TarefaModel.remover(
      req.session.userId,
      id
    );

    req.session.flash = "Tarefa removida!";
    return res.redirect("/tarefas");
  }
);