import * as authService from '../services/authService.js';

export async function signup(req, res) {
  const { email, password, name } = req.body;
  const user = await authService.signup({
    email: email.trim(),
    password,
    name,
  });
  res.status(201).json(user);
}

export async function login(req, res) {
  const { email, password } = req.body;
  const result = await authService.login({ email, password });
  res.status(200).json(result);
}