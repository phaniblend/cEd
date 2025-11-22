package handlers

import (
	"strconv"

	"github.com/ced/alm-service/database"
	"github.com/ced/alm-service/middleware"
	"github.com/ced/alm-service/models"
	"github.com/gofiber/fiber/v2"
)

type ProjectHandler struct {
	projectRepo *models.ProjectRepository
}

func NewProjectHandler() *ProjectHandler {
	return &ProjectHandler{
		projectRepo: models.NewProjectRepository(database.DB),
	}
}

func (h *ProjectHandler) CreateProject(c *fiber.Ctx) error {
	var req struct {
		Name        string `json:"name"`
		Description string `json:"description"`
		Private     bool   `json:"private"`
		OwnerID     int64  `json:"owner_id"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Get user ID from JWT token, fallback to request body
	ownerID := middleware.GetUserID(c)
	if ownerID == 0 {
		ownerID = req.OwnerID
	}
	if ownerID == 0 {
		return c.Status(400).JSON(fiber.Map{
			"error": "owner_id is required",
		})
	}

	project := &models.Project{
		Name:        req.Name,
		Description: req.Description,
		OwnerID:     ownerID,
		Private:     req.Private,
	}

	if err := h.projectRepo.Create(project); err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to create project",
		})
	}

	return c.Status(201).JSON(project)
}

func (h *ProjectHandler) GetProject(c *fiber.Ctx) error {
	id, err := strconv.ParseInt(c.Params("id"), 10, 64)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid project ID",
		})
	}

	project, err := h.projectRepo.FindByID(id)
	if err != nil || project == nil {
		return c.Status(404).JSON(fiber.Map{
			"error": "Project not found",
		})
	}

	return c.JSON(project)
}

func (h *ProjectHandler) ListProjects(c *fiber.Ctx) error {
	// Try to get owner_id from query param, fallback to JWT token
	ownerIDStr := c.Query("owner_id")
	ownerID := middleware.GetUserID(c) // Get from JWT token
	
	if ownerIDStr != "" {
		var err error
		ownerID, err = strconv.ParseInt(ownerIDStr, 10, 64)
		if err != nil {
			return c.Status(400).JSON(fiber.Map{
				"error": "Invalid owner_id",
			})
		}
	}
	
	if ownerID == 0 {
		return c.Status(400).JSON(fiber.Map{
			"error": "owner_id is required",
		})
	}
	
	projects, err := h.projectRepo.ListByOwner(ownerID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to list projects",
		})
	}

	return c.JSON(fiber.Map{
		"projects": projects,
	})
}

