export function login(req, res) {
  const { email } = req.body;

  // Dummy login for MVP — replace later with JWT + DB
  if (!email) {
    return res.status(400).json({ error: "Email required" });
  }

  return res.json({
    success: true,
    user: { email, role: "learner" }
  });
}

export function register(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email required" });
  }

  return res.json({
    success: true,
    user: { email, role: "learner" }
  });
}
