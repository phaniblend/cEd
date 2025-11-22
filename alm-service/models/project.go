package models

import (
	"database/sql"
	"time"
)

type Project struct {
	ID          int64     `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	OwnerID     int64     `json:"owner_id"`
	Private     bool      `json:"private"`
	GiteaRepoID int64     `json:"gitea_repo_id,omitempty"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type ProjectRepository struct {
	DB *sql.DB
}

func NewProjectRepository(db *sql.DB) *ProjectRepository {
	return &ProjectRepository{DB: db}
}

func (r *ProjectRepository) Create(project *Project) error {
	query := `
		INSERT INTO projects (name, description, owner_id, private, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id
	`
	err := r.DB.QueryRow(
		query,
		project.Name,
		project.Description,
		project.OwnerID,
		project.Private,
		time.Now(),
		time.Now(),
	).Scan(&project.ID)
	return err
}

func (r *ProjectRepository) FindByID(id int64) (*Project, error) {
	project := &Project{}
	query := `SELECT id, name, description, owner_id, private, gitea_repo_id, created_at, updated_at
	          FROM projects WHERE id = $1`
	err := r.DB.QueryRow(query, id).Scan(
		&project.ID,
		&project.Name,
		&project.Description,
		&project.OwnerID,
		&project.Private,
		&project.GiteaRepoID,
		&project.CreatedAt,
		&project.UpdatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	return project, err
}

func (r *ProjectRepository) ListByOwner(ownerID int64) ([]Project, error) {
	query := `SELECT id, name, description, owner_id, private, gitea_repo_id, created_at, updated_at
	          FROM projects WHERE owner_id = $1 ORDER BY created_at DESC`
	rows, err := r.DB.Query(query, ownerID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var projects []Project
	for rows.Next() {
		var project Project
		err := rows.Scan(
			&project.ID,
			&project.Name,
			&project.Description,
			&project.OwnerID,
			&project.Private,
			&project.GiteaRepoID,
			&project.CreatedAt,
			&project.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		projects = append(projects, project)
	}
	return projects, nil
}

