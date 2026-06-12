import { Router, Request, Response } from "express";
import * as TarefaModel from "../models/tarefaModel";
import { requireAuth } from "../middleware/requireAuth";

export const tarefaRoutes = Router();

// GET /tarefas
tarefaRoutes.get(
  "/tarefas",
  requireAuth,
  async (req: Request, res: Response) => {
    const tarefas = await TarefaModel.listarPorUsuario(
      req.session.userId!
    );

    const flash = req.session.flash;
    req.session.flash = null;

    return res.render("tarefas", {
      nome: req.session.userName,
      tarefas,
      flash,
    });
  }
);

// POST /tarefas
tarefaRoutes.post(
  "/tarefas",
  requireAuth,
  async (req: Request, res: Response) => {
    const { texto } = req.body;

    if (!texto || texto.trim() === "") {
      req.session.flash = "Digite uma tarefa";
      return res.redirect("/tarefas");
    }

    await TarefaModel.adicionar(
      req.session.userId!,
      texto.trim()
    );

    req.session.flash = "Tarefa adicionada!";
    return res.redirect("/tarefas");
  }
);

// POST /tarefas/:id/concluir
tarefaRoutes.post(
  "/tarefas/:id/concluir",
  requireAuth,
  async (req: Request, res: Response) => {
    await TarefaModel.toggleConcluida(
      req.session.userId!,
      Number(req.params.id)
    );

    res.redirect("/tarefas");
  }
);

// POST /tarefas/:id/remover
tarefaRoutes.post(
  "/tarefas/:id/remover",
  requireAuth,
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    await TarefaModel.remover(
      req.session.userId!,
      id
    );

    req.session.flash = "Tarefa removida!";
    return res.redirect("/tarefas");
  }
);