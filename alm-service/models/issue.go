package models

import (
	"database/sql"
	"time"
)

type IssueStatus string

const (
	IssueStatusOpen   IssueStatus = "open"
	IssueStatusClosed IssueStatus = "closed"
	IssueStatusInProgress IssueStatus = "in_progress"
)

type Issue struct {
	ID          int64      `json:"id"`
	ProjectID   int64      `json:"project_id"`
	Title       string     `json:"title"`
	Description string     `json:"description"`
	Status      IssueStatus `json:"status"`
	AssigneeID  *int64     `json:"assignee_id,omitempty"`
	CreatorID   int64      `json:"creator_id"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
}

type IssueRepository struct {
	DB *sql.DB
}

func NewIssueRepository(db *sql.DB) *IssueRepository {
	return &IssueRepository{DB: db}
}

func (r *IssueRepository) Create(issue *Issue) error {
	query := `
		INSERT INTO issues (project_id, title, description, status, assignee_id, creator_id, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING id
	`
	err := r.DB.QueryRow(
		query,
		issue.ProjectID,
		issue.Title,
		issue.Description,
		issue.Status,
		issue.AssigneeID,
		issue.CreatorID,
		time.Now(),
		time.Now(),
	).Scan(&issue.ID)
	return err
}

func (r *IssueRepository) FindByID(id int64) (*Issue, error) {
	issue := &Issue{}
	query := `SELECT id, project_id, title, description, status, assignee_id, creator_id, created_at, updated_at
	          FROM issues WHERE id = $1`
	err := r.DB.QueryRow(query, id).Scan(
		&issue.ID,
		&issue.ProjectID,
		&issue.Title,
		&issue.Description,
		&issue.Status,
		&issue.AssigneeID,
		&issue.CreatorID,
		&issue.CreatedAt,
		&issue.UpdatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	return issue, err
}

func (r *IssueRepository) ListByProject(projectID int64) ([]Issue, error) {
	query := `SELECT id, project_id, title, description, status, assignee_id, creator_id, created_at, updated_at
	          FROM issues WHERE project_id = $1 ORDER BY created_at DESC`
	rows, err := r.DB.Query(query, projectID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var issues []Issue
	for rows.Next() {
		var issue Issue
		err := rows.Scan(
			&issue.ID,
			&issue.ProjectID,
			&issue.Title,
			&issue.Description,
			&issue.Status,
			&issue.AssigneeID,
			&issue.CreatorID,
			&issue.CreatedAt,
			&issue.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		issues = append(issues, issue)
	}
	return issues, nil
}

func (r *IssueRepository) UpdateStatus(id int64, status IssueStatus) error {
	query := `UPDATE issues SET status = $1, updated_at = $2 WHERE id = $3`
	_, err := r.DB.Exec(query, status, time.Now(), id)
	return err
}

