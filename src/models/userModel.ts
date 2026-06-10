import { readFile, writeFile } from "fs/promises";
import bcrypt from "bcrypt";
import { Role } from "../types/Role";

export interface User {
  id: number;
  nome: string;
  email: string;
  senha: string;
  role: Role;
}

const ARQUIVO = "dados/usuarios.json";
const SALT_ROUNDS = 10;

export async function carregar(): Promise<User[]> {
  try {
    const dados = await readFile(ARQUIVO, "utf-8");
    return JSON.parse(dados);
  } catch {
    return [];
  }
}

export async function salvar(users: User[]): Promise<void> {
  await writeFile(ARQUIVO, JSON.stringify(users, null, 2));
}

export async function buscarPorEmail(
  email: string
): Promise<User | undefined> {
  const users = await carregar();
  return users.find((u) => u.email === email);
}

export async function buscarPorId(
  id: number
): Promise<User | undefined> {
  const users = await carregar();
  return users.find((u) => u.id === id);
}

export async function registrar(
  nome: string,
  email: string,
  senhaTexto: string
): Promise<User> {
  const users = await carregar();

  const existente = users.find((u) => u.email === email);

  if (existente) {
    throw new Error("E-mail já cadastrado");
  }

  const senhaHash = await bcrypt.hash(
    senhaTexto,
    SALT_ROUNDS
  );

  const novoUser: User = {
    id: Date.now(),
    nome,
    email,
    senha: senhaHash,
    role:
      users.length === 0
        ? Role.ADMIN
        : Role.USER,
  };

  users.push(novoUser);

  await salvar(users);

  return novoUser;
}

export async function login(
  email: string,
  senhaTexto: string
): Promise<User | null> {
  const user = await buscarPorEmail(email);

  if (!user) {
    return null;
  }

  const senhaValida = await bcrypt.compare(
    senhaTexto,
    user.senha
  );

  return senhaValida ? user : null;
}

export async function listarUsuarios(): Promise<User[]> {
  return carregar();
}