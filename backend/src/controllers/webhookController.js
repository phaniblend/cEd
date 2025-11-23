// Not used directly — webhookRoutes calls handler directly.
// Keeping file for future expansion.

export function webhookTest(req, res) {
  return res.json({ ok: true, source: "webhookController" });
}
