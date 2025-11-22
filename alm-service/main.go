package main

import (
	"log"
	"os"

	"github.com/ced/alm-service/database"
	"github.com/ced/alm-service/handlers"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	app := fiber.New(fiber.Config{
		AppName: "cEd ALM Service",
	})

	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "*",
		AllowMethods:     "GET,POST,PUT,DELETE,OPTIONS",
		AllowHeaders:     "Origin,Content-Type,Accept,Authorization",
		AllowCredentials: true,
	}))

	// Connect to database
	if err := database.Connect(); err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer database.Close()

	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status": "ok",
			"service": "alm-service",
		})
	})

	// Project routes
	projectHandler := handlers.NewProjectHandler()
	issueHandler := handlers.NewIssueHandler()
	prHandler := handlers.NewPullRequestHandler()
	
	// Public routes
	api := app.Group("/api/v1")
	api.Get("/projects/:id", projectHandler.GetProject)
	api.Get("/issues", issueHandler.ListIssues)
	api.Get("/issues/:id", issueHandler.GetIssue)
	api.Get("/pull-requests", prHandler.ListPullRequests)
	api.Get("/pull-requests/:id", prHandler.GetPullRequest)
	
	// Protected routes (require authentication)
	protected := api.Group("", middleware.AuthMiddleware())
	protected.Post("/projects", projectHandler.CreateProject)
	protected.Get("/projects", projectHandler.ListProjects)
	protected.Post("/issues", issueHandler.CreateIssue)
	protected.Patch("/issues/:id/status", issueHandler.UpdateIssueStatus)
	protected.Post("/pull-requests", prHandler.CreatePullRequest)
	protected.Patch("/pull-requests/:id/status", prHandler.UpdatePullRequestStatus)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8002"
	}

	log.Printf("ALM Service starting on port %s", port)
	log.Fatal(app.Listen(":" + port))
}

