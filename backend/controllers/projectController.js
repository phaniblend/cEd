import Project from "../models/Project.js";

export const createProject = async (req, res) => {
  try {
    const { name, description, techStack } = req.body;
    const userId = req.user.id;

    const project = await Project.create({
      name,
      description,
      techStack,
      ownerId: userId,
      repoUrl: null  // filled after Gitea integration
    });

    return res.json({ success: true, project });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const listProjects = async (req, res) => {
  try {
    const userId = req.user.id;

    const projects = await Project.findAll({
      where: { ownerId: userId },
      order: [["createdAt", "DESC"]],
    });

    return res.json({ success: true, projects });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};
