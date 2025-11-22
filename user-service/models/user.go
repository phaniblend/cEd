package models

import (
	"database/sql"
	"time"
)

type User struct {
	ID        int64     `json:"id"`
	Email     string    `json:"email"`
	Username  string    `json:"username"`
	Password  string    `json:"-"` // Never return password in JSON
	FullName  string    `json:"full_name"`
	AvatarURL string    `json:"avatar_url"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type UserRepository struct {
	DB *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{DB: db}
}

func (r *UserRepository) Create(user *User) error {
	query := `
		INSERT INTO users (email, username, password, full_name, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id
	`
	err := r.DB.QueryRow(
		query,
		user.Email,
		user.Username,
		user.Password,
		user.FullName,
		time.Now(),
		time.Now(),
	).Scan(&user.ID)
	return err
}

func (r *UserRepository) FindByEmail(email string) (*User, error) {
	user := &User{}
	query := `SELECT id, email, username, password, full_name, avatar_url, created_at, updated_at
	          FROM users WHERE email = $1`
	err := r.DB.QueryRow(query, email).Scan(
		&user.ID,
		&user.Email,
		&user.Username,
		&user.Password,
		&user.FullName,
		&user.AvatarURL,
		&user.CreatedAt,
		&user.UpdatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	return user, err
}

func (r *UserRepository) FindByID(id int64) (*User, error) {
	user := &User{}
	query := `SELECT id, email, username, password, full_name, avatar_url, created_at, updated_at
	          FROM users WHERE id = $1`
	err := r.DB.QueryRow(query, id).Scan(
		&user.ID,
		&user.Email,
		&user.Username,
		&user.Password,
		&user.FullName,
		&user.AvatarURL,
		&user.CreatedAt,
		&user.UpdatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	return user, err
}

