package handlers

import (
	"strconv"

	"github.com/ced/alm-service/database"
	"github.com/ced/alm-service/middleware"
	"github.com/ced/alm-service/models"
	"github.com/gofiber/fiber/v2"
)

type IssueHandler struct {
	issueRepo *models.IssueRepository
}

func NewIssueHandler() *IssueHandler {
	return &IssueHandler{
		issueRepo: models.NewIssueRepository(database.DB),
	}
}

func (h *IssueHandler) CreateIssue(c *fiber.Ctx) error {
	var req struct {
		ProjectID   int64  `json:"project_id"`
		Title       string `json:"title"`
		Description string `json:"description"`
		Status      string `json:"status"`
		AssigneeID  *int64 `json:"assignee_id"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	creatorID := middleware.GetUserID(c)
	if creatorID == 0 {
		return c.Status(401).JSON(fiber.Map{
			"error": "Authentication required",
		})
	}
	status := models.IssueStatusOpen
	if req.Status != "" {
		status = models.IssueStatus(req.Status)
	}

	issue := &models.Issue{
		ProjectID:   req.ProjectID,
		Title:       req.Title,
		Description: req.Description,
		Status:      status,
		AssigneeID:  req.AssigneeID,
		CreatorID:   creatorID,
	}

	if err := h.issueRepo.Create(issue); err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to create issue",
		})
	}

	return c.Status(201).JSON(issue)
}

func (h *IssueHandler) GetIssue(c *fiber.Ctx) error {
	id, err := strconv.ParseInt(c.Params("id"), 10, 64)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid issue ID",
		})
	}

	issue, err := h.issueRepo.FindByID(id)
	if err != nil || issue == nil {
		return c.Status(404).JSON(fiber.Map{
			"error": "Issue not found",
		})
	}

	return c.JSON(issue)
}

func (h *IssueHandler) ListIssues(c *fiber.Ctx) error {
	projectID, err := strconv.ParseInt(c.Query("project_id"), 10, 64)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "project_id query parameter required",
		})
	}

	issues, err := h.issueRepo.ListByProject(projectID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to list issues",
		})
	}

	return c.JSON(fiber.Map{
		"issues": issues,
	})
}

func (h *IssueHandler) UpdateIssueStatus(c *fiber.Ctx) error {
	id, err := strconv.ParseInt(c.Params("id"), 10, 64)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid issue ID",
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

	status := models.IssueStatus(req.Status)
	if status != models.IssueStatusOpen && status != models.IssueStatusClosed && status != models.IssueStatusInProgress {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid status",
		})
	}

	if err := h.issueRepo.UpdateStatus(id, status); err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to update issue",
		})
	}

	issue, _ := h.issueRepo.FindByID(id)
	return c.JSON(issue)
}

