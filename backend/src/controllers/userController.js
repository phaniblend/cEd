import { getUserByEmail, createUser } from "../services/userService.js";

export async function fetchUser(req, res) {
  const { email } = req.params;
  const user = await getUserByEmail(email);
  return res.json({ success: true, user });
}

export async function addUser(req, res) {
  const { email } = req.body;
  const user = await createUser(email);
  return res.json({ success: true, user });
}
