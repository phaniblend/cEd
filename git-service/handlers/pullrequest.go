package handlers

import (
	"github.com/ced/git-service/internal/gitea"
	"github.com/gofiber/fiber/v2"
)

type PullRequestHandler struct {
	giteaClient *gitea.Client
}

func NewPullRequestHandler() *PullRequestHandler {
	return &PullRequestHandler{
		giteaClient: gitea.NewClient(),
	}
}

// CreatePullRequest creates a new pull request via Gitea
func (h *PullRequestHandler) CreatePullRequest(c *fiber.Ctx) error {
	var req struct {
		Owner string `json:"owner"`
		Repo  string `json:"repo"`
		Title string `json:"title"`
		Body  string `json:"body"`
		Base  string `json:"base"`
		Head  string `json:"head"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	pr, err := h.giteaClient.CreatePullRequest(req.Owner, req.Repo, req.Title, req.Body, req.Base, req.Head)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(201).JSON(fiber.Map{
		"id":     pr.ID,
		"number": pr.Number,
		"title":  pr.Title,
		"body":   pr.Body,
		"state":  pr.State,
		"base":   pr.Base.Ref,
		"head":   pr.Head.Ref,
	})
}

