package models

import (
	"database/sql"
	"time"
)

type PullRequestStatus string

const (
	PRStatusOpen   PullRequestStatus = "open"
	PRStatusClosed PullRequestStatus = "closed"
	PRStatusMerged PullRequestStatus = "merged"
)

type PullRequest struct {
	ID          int64            `json:"id"`
	ProjectID   int64            `json:"project_id"`
	Title       string           `json:"title"`
	Description string           `json:"description"`
	Status      PullRequestStatus `json:"status"`
	BaseBranch  string           `json:"base_branch"`
	HeadBranch  string           `json:"head_branch"`
	AuthorID    int64            `json:"author_id"`
	ReviewerID  *int64           `json:"reviewer_id,omitempty"`
	GiteaPRID   *int64           `json:"gitea_pr_id,omitempty"`
	CreatedAt   time.Time        `json:"created_at"`
	UpdatedAt   time.Time        `json:"updated_at"`
}

type PullRequestRepository struct {
	DB *sql.DB
}

func NewPullRequestRepository(db *sql.DB) *PullRequestRepository {
	return &PullRequestRepository{DB: db}
}

func (r *PullRequestRepository) Create(pr *PullRequest) error {
	query := `
		INSERT INTO pull_requests (project_id, title, description, status, base_branch, head_branch, author_id, reviewer_id, gitea_pr_id, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
		RETURNING id
	`
	err := r.DB.QueryRow(
		query,
		pr.ProjectID,
		pr.Title,
		pr.Description,
		pr.Status,
		pr.BaseBranch,
		pr.HeadBranch,
		pr.AuthorID,
		pr.ReviewerID,
		pr.GiteaPRID,
		time.Now(),
		time.Now(),
	).Scan(&pr.ID)
	return err
}

func (r *PullRequestRepository) FindByID(id int64) (*PullRequest, error) {
	pr := &PullRequest{}
	query := `SELECT id, project_id, title, description, status, base_branch, head_branch, author_id, reviewer_id, gitea_pr_id, created_at, updated_at
	          FROM pull_requests WHERE id = $1`
	err := r.DB.QueryRow(query, id).Scan(
		&pr.ID,
		&pr.ProjectID,
		&pr.Title,
		&pr.Description,
		&pr.Status,
		&pr.BaseBranch,
		&pr.HeadBranch,
		&pr.AuthorID,
		&pr.ReviewerID,
		&pr.GiteaPRID,
		&pr.CreatedAt,
		&pr.UpdatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	return pr, err
}

func (r *PullRequestRepository) ListByProject(projectID int64) ([]PullRequest, error) {
	query := `SELECT id, project_id, title, description, status, base_branch, head_branch, author_id, reviewer_id, gitea_pr_id, created_at, updated_at
	          FROM pull_requests WHERE project_id = $1 ORDER BY created_at DESC`
	rows, err := r.DB.Query(query, projectID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var prs []PullRequest
	for rows.Next() {
		var pr PullRequest
		err := rows.Scan(
			&pr.ID,
			&pr.ProjectID,
			&pr.Title,
			&pr.Description,
			&pr.Status,
			&pr.BaseBranch,
			&pr.HeadBranch,
			&pr.AuthorID,
			&pr.ReviewerID,
			&pr.GiteaPRID,
			&pr.CreatedAt,
			&pr.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		prs = append(prs, pr)
	}
	return prs, nil
}

func (r *PullRequestRepository) UpdateStatus(id int64, status PullRequestStatus) error {
	query := `UPDATE pull_requests SET status = $1, updated_at = $2 WHERE id = $3`
	_, err := r.DB.Exec(query, status, time.Now(), id)
	return err
}

