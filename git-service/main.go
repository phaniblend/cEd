package main

import (
	"log"
	"os"

	"github.com/ced/git-service/handlers"
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
		AppName: "cEd Git Service",
	})

	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "*",
		AllowMethods:     "GET,POST,PUT,DELETE,OPTIONS",
		AllowHeaders:     "Origin,Content-Type,Accept,Authorization",
		AllowCredentials: true,
	}))

	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status": "ok",
			"service": "git-service",
		})
	})

	// Repository routes
	repoHandler := handlers.NewRepositoryHandler()
	prHandler := handlers.NewPullRequestHandler()
	api := app.Group("/api/v1")
	api.Post("/repos", repoHandler.CreateRepository)
	api.Get("/repos/:owner/:name", repoHandler.GetRepository)
	api.Get("/repos/:owner/:name/branches", repoHandler.ListBranches)
	
	// Pull Request routes
	api.Post("/repos/:owner/:name/pulls", prHandler.CreatePullRequest)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8001"
	}

	log.Printf("Git Service starting on port %s", port)
	log.Fatal(app.Listen(":" + port))
}

