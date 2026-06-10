import express from "express";
import session from "express-session";

import { authRoutes } from "./routes/authRoutes";
import { tarefaRoutes } from "./routes/tarefaRoutes";
import { adminRoutes } from "./routes/adminRoutes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "app-tarefas-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 dia
    },
  })
);

app.set("view engine", "ejs");
app.set("views", "./src/views");

app.use(express.static("public"));

app.use(authRoutes);
app.use(tarefaRoutes);
app.use(adminRoutes);

app.listen(3000, () => {
  console.log("✅ App Tarefas rodando em http://localhost:3000");
});