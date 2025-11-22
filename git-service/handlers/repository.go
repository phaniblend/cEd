package handlers

import (
	"github.com/ced/git-service/internal/gitea"
	"github.com/gofiber/fiber/v2"
)

type RepositoryHandler struct {
	giteaClient *gitea.Client
}

func NewRepositoryHandler() *RepositoryHandler {
	return &RepositoryHandler{
		giteaClient: gitea.NewClient(),
	}
}

// CreateRepository creates a new repository via Gitea
func (h *RepositoryHandler) CreateRepository(c *fiber.Ctx) error {
	var req struct {
		Name    string `json:"name"`
		Owner   string `json:"owner"`
		Private bool   `json:"private"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	repo, err := h.giteaClient.CreateRepository(req.Owner, req.Name, req.Private)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(201).JSON(fiber.Map{
		"id":          repo.ID,
		"name":        repo.Name,
		"full_name":   repo.FullName,
		"description": repo.Description,
		"private":     repo.Private,
	})
}

// GetRepository retrieves repository information
func (h *RepositoryHandler) GetRepository(c *fiber.Ctx) error {
	owner := c.Params("owner")
	name := c.Params("name")

	repo, err := h.giteaClient.GetRepository(owner, name)
	if err != nil {
		return c.Status(404).JSON(fiber.Map{
			"error": "Repository not found",
		})
	}

	return c.JSON(fiber.Map{
		"id":          repo.ID,
		"name":        repo.Name,
		"full_name":   repo.FullName,
		"description": repo.Description,
		"private":     repo.Private,
	})
}

// ListBranches lists all branches for a repository
func (h *RepositoryHandler) ListBranches(c *fiber.Ctx) error {
	owner := c.Params("owner")
	name := c.Params("name")

	branches, err := h.giteaClient.ListBranches(owner, name)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"branches": branches,
	})
}

