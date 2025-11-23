// Placeholder user service (no DB yet)

export async function getUserByEmail(email) {
  return { email, role: "learner" };
}

export async function createUser(email) {
  return { email, role: "learner" };
}
