package handlers

import (
	"strconv"

	"github.com/ced/alm-service/database"
	"github.com/ced/alm-service/middleware"
	"github.com/ced/alm-service/models"
	"github.com/gofiber/fiber/v2"
)

type PullRequestHandler struct {
	prRepo *models.PullRequestRepository
}

func NewPullRequestHandler() *PullRequestHandler {
	return &PullRequestHandler{
		prRepo: models.NewPullRequestRepository(database.DB),
	}
}

func (h *PullRequestHandler) CreatePullRequest(c *fiber.Ctx) error {
	var req struct {
		ProjectID   int64  `json:"project_id"`
		Title       string `json:"title"`
		Description string `json:"description"`
		BaseBranch  string `json:"base_branch"`
		HeadBranch  string `json:"head_branch"`
		GiteaPRID   *int64 `json:"gitea_pr_id"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	authorID := middleware.GetUserID(c)
	if authorID == 0 {
		return c.Status(401).JSON(fiber.Map{
			"error": "Authentication required",
		})
	}

	pr := &models.PullRequest{
		ProjectID:   req.ProjectID,
		Title:       req.Title,
		Description: req.Description,
		Status:      models.PRStatusOpen,
		BaseBranch:  req.BaseBranch,
		HeadBranch:  req.HeadBranch,
		AuthorID:    authorID,
		GiteaPRID:   req.GiteaPRID,
	}

	if err := h.prRepo.Create(pr); err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to create pull request",
		})
	}

	return c.Status(201).JSON(pr)
}

func (h *PullRequestHandler) GetPullRequest(c *fiber.Ctx) error {
	id, err := strconv.ParseInt(c.Params("id"), 10, 64)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid PR ID",
		})
	}

	pr, err := h.prRepo.FindByID(id)
	if err != nil || pr == nil {
		return c.Status(404).JSON(fiber.Map{
			"error": "Pull request not found",
		})
	}

	return c.JSON(pr)
}

func (h *PullRequestHandler) ListPullRequests(c *fiber.Ctx) error {
	projectID, err := strconv.ParseInt(c.Query("project_id"), 10, 64)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "project_id query parameter required",
		})
	}

	prs, err := h.prRepo.ListByProject(projectID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to list pull requests",
		})
	}

	return c.JSON(fiber.Map{
		"pull_requests": prs,
	})
}

func (h *PullRequestHandler) UpdatePullRequestStatus(c *fiber.Ctx) error {
	id, err := strconv.ParseInt(c.Params("id"), 10, 64)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid PR ID",
		})
	}

	var req struct {
		Status string `json:"status"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	status := models.PullRequestStatus(req.Status)
	if status != models.PRStatusOpen && status != models.PRStatusClosed && status != models.PRStatusMerged {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid status",
		})
	}

	if err := h.prRepo.UpdateStatus(id, status); err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to update pull request",
		})
	}

	pr, _ := h.prRepo.FindByID(id)
	return c.JSON(pr)
}

